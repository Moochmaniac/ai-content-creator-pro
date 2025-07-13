<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Creator Pro Workbench - Command Center v3</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>

    <div id="aicp-container">
        <div class="aicp-main-header">
            <div class="aicp-header-title">AI Creator Pro</div>
            <div class="aicp-task-selector-wrapper">
                <label for="aicp-task-selector">Select a Task:</label>
                <select id="aicp-task-selector">
                    <option value="standard-content">Content Creation</option>
                    <option value="image-studio">Image Studio</option>
                    <option value="code-assistant">Code Assistant</option>
                    <option value="fleet-manager">Content Fleet Manager</option>
                </select>
            </div>
        </div>

        <div id="aicp-module-container"></div>

        <div class="aicp-main-footer">
            <button id="aicp-generation-settings-btn" class="aicp-icon-button" title="[PLACEHOLDER] Open generation settings">⚙️</button>
            <button id="aicp-main-generate-btn" class="aicp-button-primary">Generate</button>
        </div>
    </div>

    <div id="aicp-settings-panel">
        <div class="aicp-panel-header"><h3>Generation Settings</h3><button id="aicp-settings-panel-close-btn" class="aicp-close-button">×</button></div>
        <div class="aicp-panel-body">
            <div class="aicp-form-row"><label>Creativity <span class="aicp-tooltip" title="[PLACEHOLDER] Controls randomness. Higher values are more creative but can be less coherent.">🔬</span></label><input type="range" min="0" max="2" step="0.1" value="0.8" class="aicp-slider"></div>
            <div class="aicp-form-row"><label>Consistency <span class="aicp-tooltip" title="[PLACEHOLDER] Controls the likelihood of sticking to common word patterns.">🔬</span></label><input type="range" min="0" max="1" step="0.05" value="0.95" class="aicp-slider"></div><hr>
            <div class="aicp-form-row aicp-toggle-row"><label for="aicp-advanced-toggle">[PLACEHOLDER] Engage Mad Scientist Mode 🧪</label><input type="checkbox" id="aicp-advanced-toggle" class="aicp-switch"></div>
            <div id="aicp-advanced-settings" class="aicp-collapsible-section"><small class="aicp-warning-text">[PLACEHOLDER] Warning: Adjusting these may cause the AI to produce unpredictable or nonsensical results!</small></div>
        </div>
    </div>
    
    <div id="aicp-dev-status-bar"></div>

    <!-- ======================= TEMPLATES ======================= -->
    
    <!-- MAIN TEMPLATE: Content Creation Module -->
    <template id="standard-content-template">
        <div class="aicp-module-padding">
            <div class="aicp-form-row-group aicp-cascading-dropdowns">
                <div class="aicp-form-row"><label>Content Type</label><select id="content-type-select"></select></div>
                <div class="aicp-form-row"><label>Platform / Format</label><select id="platform-format-select" disabled></select></div>
                <div class="aicp-form-row"><label>Layout</label><select id="layout-select" disabled></select></div>
            </div>
            <!-- Dynamic Layout UI will be injected here -->
            <div id="aicp-layout-container">
                 <div class="aicp-placeholder">[PLACEHOLDER] Select a content type to begin.</div>
            </div>
        </div>
        <div class="aicp-output-area">
            <div class="aicp-output-header"><span>Generated Content</span><div class="aicp-action-bar"></div></div>
            <div id="main-output-content" class="aicp-output-content" contenteditable="true"></div>
            <div class="aicp-char-counter">0 characters</div>
        </div>
    </template>
    
    <!-- SUB-TEMPLATE: Facebook Wall Post -->
    <template id="facebook-wall-post-layout">
        <div class="aicp-form-row">
            <label for="fb-post-topic">Post Topic</label>
            <textarea id="fb-post-topic" class="aicp-textarea" placeholder="e.g., Announcing our new summer sale starting next week!"></textarea>
        </div>
        <div class="aicp-form-row">
            <label><input type="checkbox" class="include-ai-image-toggle"> Include AI-Generated Image</label>
        </div>
        <div class="ai-image-prompt-section aicp-collapsible-section">
            <div class="aicp-form-row"><label for="image-desc-input">Image Description</label><textarea id="image-desc-input" class="aicp-textarea" placeholder="e.g., A bright, sunny beach scene with people enjoying our product"></textarea></div>
        </div>
    </template>

    <!-- SUB-TEMPLATE: Facebook Reel Script -->
    <template id="facebook-reel-script-layout">
        <div class="aicp-form-row">
            <label for="reel-topic">Reel Topic / Idea</label>
            <input id="reel-topic" type="text" class="aicp-input" placeholder="e.g., How to use our new product in 3 easy steps">
        </div>
        <hr>
        <div class="aicp-form-row">
            <label>Hook (First 3 seconds) <span class="aicp-tooltip" title="[PLACEHOLDER] Grab the viewer's attention immediately. State a controversial opinion or ask a compelling question.">🔬</span></label>
            <input type="text" class="aicp-input" placeholder="Generated hook will appear here...">
        </div>
        <div class="aicp-form-row">
            <label>Main Points / Scenes</label>
            <textarea class="aicp-textarea" rows="4" placeholder="Generated scene-by-scene script will appear here..."></textarea>
        </div>
         <div class="aicp-form-row">
            <label>Call to Action</label>
            <input type="text" class="aicp-input" placeholder="Generated call to action will appear here...">
        </div>
    </template>
    
    <!-- NOTE: We would add more sub-templates for Twitter, Blog Posts, etc. here -->
    
    <template id="image-studio-template">
        <!-- (Code from previous version is unchanged) -->
    </template>
    <template id="code-assistant-template">
        <!-- (Code from previous version is unchanged) -->
    </template>
    <template id="fleet-manager-template">
        <!-- (Code from previous version is unchanged) -->
    </template>

    <script src="assets/admin.js"></script>
</body>
</html>
