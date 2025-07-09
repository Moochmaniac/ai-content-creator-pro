<?php
/**
 * Plugin Name: AI Content Creator Pro
 * Plugin URI:  https://yoursite.com/ai-content-creator
 * Description: AI-powered content creation plugin with advanced controls and a centralized AI service.
 * Version:     1.6.0
 * Author:      Your Name
 * License:     GPL v2 or later
 * Text Domain: aicp-domain
 */

if (!defined('ABSPATH')) exit;

// IMPORTANT: Replace with your actual GCP Ollama endpoint URL
define('AICP_API_ENDPOINT', 'http://YOUR_GCP_INSTANCE_IP:11434'); 
define('AICP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AICP_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('AICP_VERSION', '1.6.0');
define('AICP_TEXT_DOMAIN', 'aicp-domain');

class AIContentCreatorPro {
    
    public function __construct() {
        add_action('init', array($this, 'init_plugin'));
        add_action('admin_init', array($this, 'register_plugin_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        
        add_action('wp_ajax_aicp_generate_content', array($this, 'handle_ajax_generate_content'));
        add_action('wp_ajax_aicp_get_models', array($this, 'handle_ajax_get_models'));
        add_action('wp_ajax_aicp_load_panel_html', array($this, 'handle_ajax_load_panel_html'));
        add_action('wp_ajax_aicp_test_connection', array($this, 'handle_ajax_test_connection'));

        register_activation_hook(__FILE__, array($this, 'activate_plugin'));
    }
    
    public function init_plugin() {
        load_plugin_textdomain(AICP_TEXT_DOMAIN, false, dirname(plugin_basename(__FILE__)) . '/languages');
        add_action('admin_bar_menu', array($this, 'add_admin_bar_item'), 100);
        add_action('admin_menu', array($this, 'add_admin_menu_page'));
        add_action('add_meta_boxes', array($this, 'add_generator_meta_box'));
    }
    
    public function activate_plugin() {
        $default_options = array('api_timeout' => 45, 'default_model' => 'llama3');
        add_option('aicp_settings', $default_options, '', 'yes');
    }
    
    public function register_plugin_settings() {
        register_setting('aicp_settings_group', 'aicp_settings', array($this, 'sanitize_settings'));
    }

    public function sanitize_settings($input) {
        $new_input = array();
        if (isset($input['api_timeout'])) { $new_input['api_timeout'] = absint($input['api_timeout']); }
        if (isset($input['default_model'])) { $new_input['default_model'] = sanitize_text_field($input['default_model']); }
        return $new_input;
    }

    public function enqueue_admin_assets($hook_suffix) {
        global $pagenow;
        $current_post_type = get_current_screen() ? get_current_screen()->post_type : '';
        $meta_box_post_types = array('post', 'page', 'bonuses');
        $is_meta_box_screen = ($pagenow === 'post.php' || $pagenow === 'post-new.php') && in_array($current_post_type, $meta_box_post_types);
        $is_settings_page = strpos($hook_suffix, 'ai-content-creator-settings') !== false;

        // Load assets on our pages OR on any page for the floating panel
        if ($is_meta_box_screen || $is_settings_page || current_user_can('edit_posts')) {
            wp_enqueue_script('aicp-admin-js', AICP_PLUGIN_URL . 'assets/admin.js', array('jquery', 'jquery-ui-draggable'), AICP_VERSION, true);
            wp_enqueue_style('aicp-admin-css', AICP_PLUGIN_URL . 'assets/admin.css', array(), AICP_VERSION);
            wp_localize_script('aicp-admin-js', 'aicp_ajax', array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce'    => wp_create_nonce('aicp_ajax_nonce'),
                'settings' => get_option('aicp_settings', array()),
                'i18n'     => array(
                    'generating' => esc_html__('Generating...', AICP_TEXT_DOMAIN),
                    'generateContent' => esc_html__('Generate Content', AICP_TEXT_DOMAIN),
                )
            ));
        }
    }
    
    public function add_admin_bar_item($wp_admin_bar) {
        if (!current_user_can('edit_posts')) return;
        $wp_admin_bar->add_menu(array(
            'id'    => 'aicp-menu',
            'title' => '<span class="ab-icon dashicons-superhero"></span> ' . esc_html__('AI Creator', AICP_TEXT_DOMAIN),
            'href'  => '#',
            'meta'  => array('class' => 'aicp-admin-bar-menu', 'onclick' => 'aicpTogglePanel(); return false;')
        ));
    }
    
    public function add_admin_menu_page() {
        add_options_page(esc_html__('AI Content Creator Settings', AICP_TEXT_DOMAIN), esc_html__('AI Content Creator', AICP_TEXT_DOMAIN), 'manage_options', 'ai-content-creator-settings', array($this, 'render_settings_page'));
    }
    
    public function render_settings_page() { /* ... Unchanged ... */ }

    public function add_generator_meta_box() {
        $post_types = array('post', 'page', 'bonuses');
        add_meta_box('aicp-content-generator', esc_html__('AI Content Creator', AICP_TEXT_DOMAIN), array($this, 'render_meta_box_content'), $post_types, 'normal', 'high');
    }

    public function render_meta_box_content($post) {
        wp_nonce_field('aicp_meta_box_security', 'aicp_meta_box_nonce');
        echo '<div class="aicp-generator-instance">' . $this->get_generator_ui_html() . '</div>';
    }

    private function get_tooltip_html($default_text) {
        return '<span class="aicp-tooltip-icon" data-tooltip="' . esc_attr($default_text) . '" aria-label="' . esc_attr__('Help', AICP_TEXT_DOMAIN) . '">?</span>';
    }

    private function get_generator_ui_html() {
        ob_start();
        ?>
        <div class="aicp-meta-box-header">
            <a href="#" class="aicp-tune-btn">
                <span class="dashicons dashicons-admin-generic"></span>
                <span><?php esc_html_e('Fine-Tuning', AICP_TEXT_DOMAIN); ?></span>
            </a>
        </div>
        <div class="aicp-drawer-wrapper">
            <div class="aicp-main-content">
                <div class="aicp-field-group">
                    <label>
                        <?php esc_html_e('Your Topic or Prompt', AICP_TEXT_DOMAIN); ?>
                        <?php echo $this->get_tooltip_html('Enter the main idea, topic, or specific instruction for the AI.'); ?>
                    </label>
                    <textarea class="aicp-content-prompt" rows="5" placeholder="<?php esc_attr_e('e.g., The top 5 benefits of a standing desk for remote workers.', AICP_TEXT_DOMAIN); ?>"></textarea>
                </div>
                <div class="aicp-format-selectors">
                    <div class="aicp-field-group aicp-category-selector">
                        <label>
                            <?php esc_html_e('Category', AICP_TEXT_DOMAIN); ?>
                            <?php echo $this->get_tooltip_html('Select the general type of content you want to create.'); ?>
                        </label>
                        <select class="aicp-output-category">
                            <option value="blog" selected><?php esc_html_e('Blog & Web', AICP_TEXT_DOMAIN); ?></option>
                            <option value="social"><?php esc_html_e('Social Media', AICP_TEXT_DOMAIN); ?></option>
                            <option value="email"><?php esc_html_e('Email', AICP_TEXT_DOMAIN); ?></option>
                            <option value="product"><?php esc_html_e('Product', AICP_TEXT_DOMAIN); ?></option>
                            <option value="tools"><?php esc_html_e('Tools & Brainstorming', AICP_TEXT_DOMAIN); ?></option>
                        </select>
                    </div>
                    <div class="aicp-field-group aicp-format-selector">
                        <label>
                             <?php esc_html_e('Specific Format', AICP_TEXT_DOMAIN); ?>
                             <?php echo $this->get_tooltip_html('Choose the exact format for the AI\'s output. This list changes based on the Category selected.'); ?>
                        </label>
                        <select class="aicp-output-format"></select> <!-- Populated by JS -->
                    </div>
                </div>
            </div>
            <div class="aicp-drawer">
                <div class="aicp-drawer-header"><h4><?php esc_html_e('Advanced Settings', AICP_TEXT_DOMAIN); ?></h4><button class="aicp-drawer-close" aria-label="<?php esc_attr_e('Close advanced settings', AICP_TEXT_DOMAIN); ?>">×</button></div>
                <div class="aicp-drawer-content">
                    <div class="aicp-field-group">
                        <label><?php esc_html_e('AI Model', AICP_TEXT_DOMAIN); ?><?php echo $this->get_tooltip_html('Different models have different strengths. The default is set in plugin settings.'); ?></label>
                        <select class="aicp-model-select"><option value=""><?php esc_html_e('Loading models...', AICP_TEXT_DOMAIN); ?></option></select>
                    </div>
                    <div class="aicp-field-group">
                        <label><?php esc_html_e('Tone of Voice', AICP_TEXT_DOMAIN); ?><?php echo $this->get_tooltip_html('Set the emotional style of the writing.'); ?></label>
                        <select class="aicp-content-tone">
                            <option value="professional" selected><?php esc_html_e('Professional', AICP_TEXT_DOMAIN); ?></option>
                            <option value="casual"><?php esc_html_e('Casual', AICP_TEXT_DOMAIN); ?></option>
                            <option value="persuasive"><?php esc_html_e('Persuasive', AICP_TEXT_DOMAIN); ?></option>
                            <option value="empathetic"><?php esc_html_e('Empathetic', AICP_TEXT_DOMAIN); ?></option>
                            <option value="humorous"><?php esc_html_e('Humorous', AICP_TEXT_DOMAIN); ?></option>
                        </select>
                    </div>
                    <div class="aicp-field-group">
                        <label><?php esc_html_e('Target Audience', AICP_TEXT_DOMAIN); ?><?php echo $this->get_tooltip_html('Who is this content for? This affects vocabulary and complexity.'); ?></label>
                        <select class="aicp-content-audience">
                            <option value="general" selected><?php esc_html_e('General Audience', AICP_TEXT_DOMAIN); ?></option>
                            <option value="beginners"><?php esc_html_e('Beginners', AICP_TEXT_DOMAIN); ?></option>
                            <option value="experts"><?php esc_html_e('Experts', AICP_TEXT_DOMAIN); ?></option>
                        </select>
                    </div>
                     <div class="aicp-field-group">
                        <label><?php esc_html_e('Point of View', AICP_TEXT_DOMAIN); ?><?php echo $this->get_tooltip_html('Choose the narrative perspective (I/we, you, or he/she/it).'); ?></label>
                        <select class="aicp-content-pov">
                            <option value="third_person" selected><?php esc_html_e('Third-Person', AICP_TEXT_DOMAIN); ?></option>
                            <option value="first_person"><?php esc_html_e('First-Person', AICP_TEXT_DOMAIN); ?></option>
                            <option value="second_person"><?php esc_html_e('Second-Person', AICP_TEXT_DOMAIN); ?></option>
                        </select>
                    </div>
                    <hr>
                    <div class="aicp-field-group">
                        <label><?php esc_html_e('Custom Personality / Instructions', AICP_TEXT_DOMAIN); ?><?php echo $this->get_tooltip_html('Add persistent instructions here to define a specific brand voice or style. For example: "Always write in a witty, slightly sarcastic tone. End each paragraph with a question. Never use corporate jargon."'); ?></label>
                        <textarea class="aicp-custom-personality" rows="4" placeholder="<?php esc_attr_e('e.g., Always use simple language. Avoid technical terms...', AICP_TEXT_DOMAIN); ?>"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="aicp-meta-box-footer">
            <button type="button" class="button button-primary aicp-generate-btn"><?php esc_html_e('Generate Content', AICP_TEXT_DOMAIN); ?></button>
            <div class="aicp-bypass-wrapper">
                <label class="aicp-switch" title="<?php esc_attr_e('Bypass Custom Personality', AICP_TEXT_DOMAIN); ?>">
                    <input type="checkbox" class="aicp-bypass-personality">
                    <span class="aicp-slider"></span>
                </label>
                <span><?php esc_html_e('Bypass Personality', AICP_TEXT_DOMAIN); ?></span>
                <?php echo $this->get_tooltip_html('Turn this ON to ignore the "Custom Personality" instructions for this one generation only. Useful for quick, neutral tasks or custom commands in the main prompt.'); ?>
            </div>
        </div>
        <div class="aicp-loading" style="display: none;"><div class="aicp-spinner"></div><p><?php esc_html_e('Generating content...', AICP_TEXT_DOMAIN); ?></p></div>
        <div class="aicp-results" style="display: none;">
             <div class="aicp-result-tabs"><button type="button" class="aicp-result-tab active" data-result="preview"><?php esc_html_e('Preview', AICP_TEXT_DOMAIN); ?></button><button type="button" class="aicp-result-tab" data-result="raw"><?php esc_html_e('Raw Text', AICP_TEXT_DOMAIN); ?></button></div>
            <div class="aicp-result-content"><div class="aicp-result-panel aicp-result-preview active"></div><div class="aicp-result-panel aicp-result-raw"><textarea readonly aria-label="<?php esc_attr_e('Raw AI Output', AICP_TEXT_DOMAIN); ?>"></textarea></div></div>
            <div class="aicp-result-actions"><button type="button" class="button button-primary aicp-insert-btn"><?php esc_html_e('Insert', AICP_TEXT_DOMAIN); ?></button><button type="button" class="button aicp-copy-btn"><?php esc_html_e('Copy', AICP_TEXT_DOMAIN); ?></button><button type="button" class="button aicp-regenerate-btn"><?php esc_html_e('Regenerate', AICP_TEXT_DOMAIN); ?></button></div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    public function handle_ajax_load_panel_html() {
        check_ajax_referer('aicp_ajax_nonce', 'nonce');
        $html = '<div class="aicp-generator-instance aicp-panel-instance">' . $this->get_generator_ui_html() . '</div>';
        wp_send_json_success(array('html' => $html));
    }

    public function handle_ajax_get_models() {
        check_ajax_referer('aicp_ajax_nonce', 'nonce');
        // ... Unchanged ...
    }

    public function handle_ajax_generate_content() {
        check_ajax_referer('aicp_ajax_nonce', 'nonce');
        // ... Unchanged ...
    }

    private function build_prompt_for_ai($user_prompt, $options) {
        // ... Unchanged ...
    }
    
    private function get_format_instruction($format_key) {
        // ... Unchanged ...
    }

    public function handle_ajax_test_connection() {
        check_ajax_referer('aicp_ajax_nonce', 'nonce');
        // ... Unchanged ...
    }
}

new AIContentCreatorPro();

// RESTORED: Add the floating panel HTML to admin pages
add_action('admin_footer', function() {
    if (!current_user_can('edit_posts')) {
        return;
    }
    ?>
    <div id="aicp-floating-panel" class="aicp-panel" style="display: none;">
        <div class="aicp-panel-header">
            <h3><span class="dashicons dashicons-superhero"></span> <?php esc_html_e('AI Content Creator', AICP_TEXT_DOMAIN); ?></h3>
            <button class="aicp-close-btn" aria-label="<?php esc_attr_e('Close AI Panel', AICP_TEXT_DOMAIN); ?>">×</button>
        </div>
        <div class="aicp-panel-content">
            <!-- Content will be loaded here by JavaScript via AJAX -->
        </div>
    </div>
    <?php
});