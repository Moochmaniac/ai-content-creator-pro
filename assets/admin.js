/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.4 (Tooltips, Model Selector, Brainstorming)
 */
document.addEventListener('DOMContentLoaded', function() {

    const AICP_App = {
        // --- Properties ---
        elements: {}, 
        state: { currentView: 'content-creator' },
        versions: { js: '2.4', css: '2.3' },

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
                    "Single Tweet": "layout-generic-text",
                }
            },
            "Blog Post": {
                "Select...": {},
                "Introduction": "layout-blog-intro",
                "Outline": "layout-topic-only",
                "Full Draft": "layout-blog-intro"
            },
            "Tools & Brainstorming": {
                "Select...": {},
                "Keyword Suggestions": "layout-topic-only",
                "Blog Post Ideas": "layout-topic-only",
                "Catchy Headlines": "layout-topic-only",
                "Analyze Content Trends": "layout-topic-only"
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
            this.fetchModels(); // Fetch models on initial load
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
            this.elements.modelSelect = document.getElementById('aicp-model-select');
        },

        /**
         * Central location for all event listeners.
         */
        registerEventListeners() {
            this.elements.taskSelector.addEventListener('change', e => this.renderView(e.target.value));
            this.elements.settingsBtn.addEventListener('click', () => this.elements.settingsPanel.classList.add('is-visible'));
            this.elements.settingsCloseBtn.addEventListener('click', () => this.elements.settingsPanel.classList.remove('is-visible'));
            
            // Tooltip listener on the body for dynamic content
            document.body.addEventListener('click', e => {
                const tooltipIcon = e.target.closest('.aicp-tooltip-icon');
                const existingTooltip = document.querySelector('.aicp-tooltip-popup');

                if (existingTooltip) {
                    existingTooltip.remove();
                }

                if (tooltipIcon) {
                    e.stopPropagation();
                    this.createTooltip(tooltipIcon);
                }
            });
        },
        
        /**
         * Main UI rendering function.
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
            
            this.populateSelect(typeSelect, Object.keys(this.contentTree));

            typeSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const platforms = this.contentTree[selectedType] || {};
                this.populateSelect(platformSelect, Object.keys(platforms));
                platformSelect.disabled = Object.keys(platforms).length <= 1;
                this.populateSelect(layoutSelect, []);
                layoutSelect.disabled = true;
                this.renderDynamicLayout(null);
            });

            platformSelect.addEventListener('change', () => {
                const selectedType = typeSelect.value;
                const selectedPlatform = platformSelect.value;
                const layouts = this.contentTree[selectedType]?.[selectedPlatform] || {};
                this.populateSelect(layoutSelect, Object.keys(layouts));
                layoutSelect.disabled = Object.keys(layouts).length <= 1;
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
                 container.innerHTML = `<div class="aicp-placeholder">Select a layout to see its options.</div>`;
                 return;
            }

            const template = document.getElementById(templateId);
            if (template) {
                container.innerHTML = '';
                container.appendChild(template.content.cloneNode(true));
            } else {
                container.innerHTML = `<div class="aicp-placeholder">Layout template "${templateId}" will appear here.</div>`;
            }
        },

        /**
         * Updates the developer status bar with current file versions.
         */
        updateDevStatus() {
            if (!this.elements.devStatusBar) this.elements.devStatusBar = document.getElementById('aicp-dev-status-bar');
            this.elements.devStatusBar.textContent = `AICP v3.3 | JS: v${this.versions.js} | CSS: v${this.versions.css}`;
        },

        /**
         * Creates and positions a tooltip next to a given icon element.
         * @param {HTMLElement} iconElement - The clicked tooltip icon.
         */
        createTooltip(iconElement) {
            const tooltipText = iconElement.dataset.tooltip || "No information available.";
            const tooltip = document.createElement('div');
            tooltip.className = 'aicp-tooltip-popup';
            tooltip.innerHTML = `<div class="aicp-tooltip-arrow"></div>${tooltipText}`;
            document.body.appendChild(tooltip);

            const iconRect = iconElement.getBoundingClientRect();
            let topPos = window.scrollY + iconRect.bottom + 8;
            let leftPos = window.scrollX + iconRect.left + (iconRect.width / 2) - (tooltip.offsetWidth / 2);
            
            // Basic boundary detection
            if (leftPos < 0) { leftPos = 5; }
            if (leftPos + tooltip.offsetWidth > window.innerWidth) { leftPos = window.innerWidth - tooltip.offsetWidth - 5; }

            tooltip.style.top = `${topPos}px`;
            tooltip.style.left = `${leftPos}px`;
        },

        /**
         * Fetches AI models from the server (placeholder).
         */
        fetchModels() {
            if (!this.elements.modelSelect) return;
            
            // Placeholder: Simulating an API call to a server
            this.elements.modelSelect.innerHTML = '<option value="">Loading models...</option>';
            setTimeout(() => {
                const models = ["llama3:latest", "mistral:latest", "codellama:latest", "phi:latest"];
                this.elements.modelSelect.innerHTML = ''; // Clear "Loading..."
                models.forEach(modelName => {
                    const option = document.createElement('option');
                    option.value = modelName;
                    option.textContent = modelName;
                    this.elements.modelSelect.appendChild(option);
                });
            }, 1000); // Simulate 1-second network delay
        }
    };

    AICP_App.init();
});
