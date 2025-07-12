/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.0
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Application Object: Encapsulates all logic ---
    const AICP_App = {
        // --- Properties ---
        elements: {}, // To store frequently accessed DOM elements
        state: {
            currentView: 'standard-content', // The default view
        },
        versions: {
            js: '2.0',
            css: '2.0',
        },

        /**
         * The main entry point for the application.
         */
        init() {
            console.log('AICP Command Center v2.0 Initializing...');
            this.cacheDOMElements();
            this.registerEventListeners();
            this.updateDevStatus();

            // Render the default view on startup
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
            this.elements.advancedToggle = document.getElementById('aicp-advanced-toggle');
            this.elements.advancedSettings = document.getElementById('aicp-advanced-settings');
        },

        /**
         * Central location for all event listeners.
         */
        registerEventListeners() {
            // Main Task Selector
            this.elements.taskSelector.addEventListener('change', (e) => {
                this.renderView(e.target.value);
            });

            // Settings Panel Toggle
            this.elements.settingsBtn.addEventListener('click', () => {
                this.elements.settingsPanel.classList.add('is-visible');
            });
            this.elements.settingsCloseBtn.addEventListener('click', () => {
                this.elements.settingsPanel.classList.remove('is-visible');
            });

            // Advanced "Mad Scientist" Mode Toggle
            this.elements.advancedToggle.addEventListener('change', (e) => {
                this.elements.advancedSettings.classList.toggle('is-expanded', e.target.checked);
            });

            // Using Event Delegation for dynamic buttons inside the module container
            this.elements.moduleContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('aicp-enhance-prompt')) {
                    alert('[PLACEHOLDER] AI Prompt Enhancement Activated!');
                }
                if (target.classList.contains('aicp-copy-button')) {
                    alert('[PLACEHOLDER] Copied to clipboard!');
                }
            });

             // Event Delegation for specific toggles
             this.elements.moduleContainer.addEventListener('change', (e) => {
                const target = e.target;
                if (target.id === 'include-ai-image-toggle') {
                    const imagePromptSection = document.getElementById('ai-image-prompt-section');
                    if (imagePromptSection) {
                        imagePromptSection.classList.toggle('is-expanded', target.checked);
                    }
                }
            });
        },

        /**
         * Main UI rendering function. Clears the container and injects the selected template.
         * @param {string} viewName - The name of the view to render (e.g., 'standard-content').
         */
        renderView(viewName) {
            this.state.currentView = viewName;
            const template = document.getElementById(`${viewName}-template`);
            
            if (!template) {
                console.error(`AICP Error: Template for view "${viewName}" not found.`);
                this.elements.moduleContainer.innerHTML = `<p class="aicp-error">Error: Could not load view.</p>`;
                return;
            }

            // Clear the container and inject the new view
            this.elements.moduleContainer.innerHTML = '';
            this.elements.moduleContainer.appendChild(template.content.cloneNode(true));

            console.log(`Rendered view: ${viewName}`);
            
            // Call specific init functions for views that need extra JS logic
            // This is a scalable way to manage view-specific code.
            // if (viewName === 'some-complex-view') { this.initSomeComplexView(); }
        },
        
        /**
         * Updates the developer status bar with current file versions.
         */
        updateDevStatus() {
            if (this.elements.devStatusBar) {
                this.elements.devStatusBar.textContent = `AICP v3 | JS: v${this.versions.js} | CSS: v${this.versions.css}`;
            }
        },

    };

    // --- Run the Application ---
    AICP_App.init();

});
