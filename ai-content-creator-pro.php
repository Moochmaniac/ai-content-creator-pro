<?php
/**
 * Plugin Name: AI Content Creator Pro
 * Description: A feature-rich AI content generator plugin for WordPress.
 * Version: 0.1.0
 * Author: Your Name
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Main plugin class
 */
class AI_Content_Creator_Pro {

    function __construct() {
        // This hook registers our main function for adding assets.
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
    }

    /**
     * Enqueue admin-specific stylesheets and JavaScript files.
     *
     * @param string $hook The current admin page hook.
     */
    public function enqueue_admin_assets( $hook ) {
        // We only want to load our assets on post editing pages.
        // This is a good practice to avoid conflicts with other plugins.
        // For now, let's try to load it everywhere to see if it works.
        // A better check would be: if ( 'post.php' != $hook && 'post-new.php' != $hook ) { return; }

        wp_enqueue_style(
            'aicp-admin-styles', // Unique handle for our stylesheet
            plugin_dir_url( __FILE__ ) . 'assets/admin.css', // Path to the file
            array(), // Dependencies
            '0.1.0' // Version number
        );

        wp_enqueue_script(
            'aicp-admin-script', // Unique handle for our script
            plugin_dir_url( __FILE__ ) . 'assets/admin.js', // Path to the file
            array(), // Dependencies
            '0.1.0', // Version number
            true // Load in footer
        );
    }

    // --- Other PHP functions for the meta box, admin bar link, etc., would go here ---
    // --- We have not written these yet. ---

}

// Initialize the plugin
new AI_Content_Creator_Pro();
