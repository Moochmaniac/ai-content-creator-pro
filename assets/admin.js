/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.2
 */
document.addEventListener('DOMContentLoaded', function() {

    const AICP_App = {
        // --- Properties ---
        elements: {}, 
        state: { currentView: 'content-creator' },
        versions: { js: '2.2', css: '2.2' },

        // --- Data structure for the intelligent content creator ---
        contentTree: {
            "Select...": {},
            "Social Media Post": {
                "Select...": {},
                "Facebook": {
                    "Select...": {},
                    "Wall Post": "layout-fb-wall-post",
                    "Reel Script": "layout-fb-reel-script"
                },
                "X (Twitter)": {
                    "Select...": {},
                    "Single Tweet": "layout-generic-text", // Example of reusing a generic template
                }
            },
            "Blog Post": {
                "Select...": {},
                "Introduction": "layout-blog-intro",
                "Outline": "layout-generic-text",
                "Full Draft": "layout-blog-intro"
            }
        },

        /**
         * The main entry point for the application.
         */
        init() {
            this.cacheDOMElements();
            this.registerEventListeners();
            this.updateDevStatus();
            this.renderView(this.state.currentView);
        },

        /**
         * Find and store key DOM elements to avoid repeated lookups.
         */
        cacheDOMElements() {
            this.elements.taskSelector = document.getElementById('aicp-task-selector');
            this.elements.moduleContainer = document.getElementById('aicp-module-container');
            this.elements.devStatusBar = document.getElementById('aicp-dev-status-bar');
            this.elements.settingsPanel = document.getElementById('aicp-settings-panel');
            this.elements.settingsBtn = document.getElementById('aicp-generation-settings-btn');
            this.elements.settingsCloseBtn = document.getElementById('aicp-settings-panel-close-btn');
        },

        /**
         * Central location for all event listeners.
         */
        registerEventListeners() {
            this.elements.taskSelector.addEventListener('change', e => this.renderView(e.target.value));
            this.elements.settingsBtn.addEventListener('click', () => this.elements.settingsPanel.classList.add('is-visible'));
            this.elements.settingsCloseBtn.addEventListener('click', () => this.elements.settingsPanel.classList.remove('is-visible'));
        },
        
        /**
         * Main UI rendering function. Clears the container and injects the selected template.
         * @param {string} viewName - The name of the view to render.
         */
        renderView(viewName) {
            this.state.currentView = viewName;
            const templateId = `${viewName}-template`;
            const template = document.getElementById(templateId);
            
            if (!template) {
                this.elements.moduleContainer.innerHTML = `<p class="aicp-error">Error: Template "${templateId}" not found.</p>`;
                return;
            }
            this.elements.moduleContainer.innerHTML = '';
            this.elements.moduleContainer.appendChild(template.content.cloneNode(true));
            
            // If the rendered view is the content creator, initialize its special logic
            if (viewName === 'content-creator') {
                this.initContentCreator();
            }
        },

        /**
         * Initializes the special logic for the Intelligent Content Creator module.
         */
        initContentCreator() {
            const typeSelect = document.getElementById('content-type-select');
            const platformSelect = document.getElementById('platform-format-select');
            const layoutSelect = document.getElementById('layout-select');
            
            if (!typeSelect || !platformSelect || !layoutSelect) {
                console.error("AICP: Could not find one or more dropdowns for Content Creator.");
                return;
            }
            
            // Populate the first dropdown
            this.populateSelect(typeSelect, Object.keys(this.contentTree));

            typeSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const platforms = this.contentTree[selectedType] || {};
                this.populateSelect(platformSelect, Object.keys(platforms));
                platformSelect.disabled = false;
                // Reset subsequent dropdowns
                this.populateSelect(layoutSelect, []);
                layoutSelect.disabled = true;
                this.renderDynamicLayout(null);
            });

            platformSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const layouts = this.contentTree[selectedType]?.[selectedPlatform] || {};
                this.populateSelect(layoutSelect, Object.keys(layouts));
                layoutSelect.disabled = false;
                this.renderDynamicLayout(null);
            });

            layoutSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const selectedLayout = layoutSelect.value;
                const templateId = this.contentTree[selectedType]?.[selectedPlatform]?.[selectedLayout] || null;
                this.renderDynamicLayout(templateId);
            });
        },

        /**
         * Helper function to populate a select dropdown with options.
         * @param {HTMLSelectElement} selectElement - The dropdown to populate.
         * @param {string[]} options - An array of strings for the options.
         */
        populateSelect(selectElement, options) {
            selectElement.innerHTML = '';
            options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
        },

        /**
         * Renders the specific UI layout for a task (e.g., Wall Post, Reel Script).
         * @param {string|null} templateId - The ID of the template to render.
         */
        renderDynamicLayout(templateId) {
            const container = document.getElementById('aicp-dynamic-layout-container');
            if (!container) return;

            if (!templateId || templateId === "Select...") {
                 container.innerHTML = `<div class="aicp-placeholder">[PLACEHOLDER] Select a layout to see its options.</div>`;
                 return;
            }

            const template = document.getElementById(templateId);
            if (template) {
                container.innerHTML = '';
                container.appendChild(template.content.cloneNode(true));
            } else {
                // Fallback for layouts not yet created
                container.innerHTML = `<div class="aicp-placeholder">[PLACEHOLDER] Layout options for "${templateId}" will appear here.</div>`;
            }
        },

        /**
         * Updates the developer status bar with current file versions.
         */
        updateDevStatus() {
            if (!this.elements.devStatusBar) this.elements.devStatusBar = document.getElementById('aicp-dev-status-bar');
            this.elements.devStatusBar.textContent = `AICP v3.2 | JS: v${this.versions.js} | CSS: v${this.versions.css}`;
        },
    };

    AICP_App.init();
});
