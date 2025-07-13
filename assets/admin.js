/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.1
 */
document.addEventListener('DOMContentLoaded', function() {

    const AICP_App = {
        elements: {}, state: { currentView: 'standard-content' },
        versions: { js: '2.1', css: '2.1' },

        // --- NEW: Data structure for the intelligent content module ---
        contentStructure: {
            "Select Type...": {},
            "Social Media": {
                "Select Platform...": {},
                "Facebook": {
                    "Select Layout...": {},
                    "Wall Post": "facebook-wall-post-layout",
                    "Reel Script": "facebook-reel-script-layout"
                },
                "X (Twitter)": {
                    "Select Layout...": {},
                    "Single Tweet": "twitter-single-tweet-layout", // (Template not yet created, but proves the structure)
                }
            },
            "Blog Post": {
                "Select Format...": {},
                "Full Post": "blog-post-full-layout", // (Template not yet created)
                "Outline": "blog-post-outline-layout" // (Template not yet created)
            }
        },
        
        init() {
            console.log('AICP Command Center v2.1 Initializing...');
            this.cacheDOMElements();
            this.registerEventListeners();
            this.updateDevStatus();
            this.renderView(this.state.currentView);
        },
        
        cacheDOMElements() {
            this.elements.taskSelector = document.getElementById('aicp-task-selector');
            this.elements.moduleContainer = document.getElementById('aicp-module-container');
            this.elements.devStatusBar = document.getElementById('aicp-dev-status-bar');
            this.elements.settingsPanel = document.getElementById('aicp-settings-panel');
            this.elements.settingsBtn = document.getElementById('aicp-generation-settings-btn');
            this.elements.settingsCloseBtn = document.getElementById('aicp-settings-panel-close-btn');
        },
        
        registerEventListeners() {
            this.elements.taskSelector.addEventListener('change', (e) => this.renderView(e.target.value));
            this.elements.settingsBtn.addEventListener('click', () => this.elements.settingsPanel.classList.add('is-visible'));
            this.elements.settingsCloseBtn.addEventListener('click', () => this.elements.settingsPanel.classList.remove('is-visible'));
        },
        
        renderView(viewName) {
            this.state.currentView = viewName;
            const template = document.getElementById(`${viewName}-template`);
            if (!template) {
                console.error(`AICP Error: Template for view "${viewName}" not found.`);
                return;
            }
            this.elements.moduleContainer.innerHTML = '';
            this.elements.moduleContainer.appendChild(template.content.cloneNode(true));
            console.log(`Rendered view: ${viewName}`);

            // If the rendered view is our new complex module, initialize it.
            if (viewName === 'standard-content') {
                this._initContentCreationModule();
            }
        },

        // --- NEW: Initialization logic for the Content Creation module ---
        _initContentCreationModule() {
            const typeSelect = document.getElementById('content-type-select');
            const platformSelect = document.getElementById('platform-format-select');
            const layoutSelect = document.getElementById('layout-select');
            const layoutContainer = document.getElementById('aicp-layout-container');

            // Helper function to populate a select dropdown
            const populateSelect = (selectEl, options) => {
                selectEl.innerHTML = '';
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = opt.textContent = option;
                    selectEl.appendChild(opt);
                });
            };

            // 1. Populate initial "Content Type" dropdown
            populateSelect(typeSelect, Object.keys(this.contentStructure));
            
            // 2. Event listener for "Content Type"
            typeSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const platforms = this.contentStructure[selectedType] || {};
                
                populateSelect(platformSelect, Object.keys(platforms));
                platformSelect.disabled = Object.keys(platforms).length <= 1;
                
                // Trigger a change to update the next level
                platformSelect.dispatchEvent(new Event('change'));
            });
            
            // 3. Event listener for "Platform/Format"
            platformSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const layouts = this.contentStructure[selectedType]?.[selectedPlatform] || {};

                populateSelect(layoutSelect, Object.keys(layouts));
                layoutSelect.disabled = Object.keys(layouts).length <= 1;

                // Trigger a change to render the layout
                layoutSelect.dispatchEvent(new Event('change'));
            });

            // 4. Event listener for "Layout" - This renders the UI
            layoutSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const selectedLayout = layoutSelect.value;
                
                const templateId = this.contentStructure[selectedType]?.[selectedPlatform]?.[selectedLayout];
                
                layoutContainer.innerHTML = ''; // Clear previous layout
                if (templateId) {
                    const template = document.getElementById(templateId);
                    if (template) {
                        layoutContainer.appendChild(template.content.cloneNode(true));
                    } else {
                        console.error(`Layout template not found: ${templateId}`);
                    }
                } else {
                    // Show placeholder if no specific layout is selected
                    layoutContainer.innerHTML = `<div class="aicp-placeholder">[PLACEHOLDER] Please make a selection.</div>`;
                }
            });

            // Trigger initial population
            typeSelect.dispatchEvent(new Event('change'));
        },
        
        updateDevStatus() {
            if (this.elements.devStatusBar) {
                this.elements.devStatusBar.textContent = `AICP v3 | JS: v${this.versions.js} | CSS: v${this.versions.css}`;
            }
        },
    };

    AICP_App.init();
});
