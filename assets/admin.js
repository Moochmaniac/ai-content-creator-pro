/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.1
 */
document.addEventListener('DOMContentLoaded', function() {

    const AICP_App = {
        elements: {}, 
        state: { currentView: 'standard-content' },
        versions: { js: '2.1', css: '2.1' },

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
                    "Single Tweet": "twitter-single-tweet-layout",
                }
            },
            "Blog Post": {
                "Select Format...": {},
                "Full Post": "blog-post-full-layout",
                "Outline": "blog-post-outline-layout"
            }
        },
        
        init() {
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

            if (viewName === 'standard-content') {
                this._initContentCreationModule();
            }
        },

        _initContentCreationModule() {
            const typeSelect = document.getElementById('content-type-select');
            const platformSelect = document.getElementById('platform-format-select');
            const layoutSelect = document.getElementById('layout-select');
            const layoutContainer = document.getElementById('aicp-layout-container');

            const populateSelect = (selectEl, options) => {
                selectEl.innerHTML = '';
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = opt.textContent = option;
                    selectEl.appendChild(opt);
                });
            };

            populateSelect(typeSelect, Object.keys(this.contentStructure));
            
            typeSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const platforms = this.contentStructure[selectedType] || {};
                populateSelect(platformSelect, Object.keys(platforms));
                platformSelect.disabled = Object.keys(platforms).length <= 1;
                platformSelect.dispatchEvent(new Event('change'));
            });
            
            platformSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const layouts = this.contentStructure[selectedType]?.[selectedPlatform] || {};
                populateSelect(layoutSelect, Object.keys(layouts));
                layoutSelect.disabled = Object.keys(layouts).length <= 1;
                layoutSelect.dispatchEvent(new Event('change'));
            });

            layoutSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const selectedLayout = layoutSelect.value;
                const templateId = this.contentStructure[selectedType]?.[selectedPlatform]?.[selectedLayout];
                
                layoutContainer.innerHTML = '';
                if (templateId) {
                    const template = document.getElementById(templateId);
                    if (template) {
                        layoutContainer.appendChild(template.content.cloneNode(true));
                    } else {
                        console.error(`Layout template not found: ${templateId}`);
                        layoutContainer.innerHTML = `<div class="aicp-placeholder">[ERROR] Layout UI not found.</div>`;
                    }
                } else {
                    layoutContainer.innerHTML = `<div class="aicp-placeholder">[PLACEHOLDER] Please make a complete selection.</div>`;
                }
            });

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
