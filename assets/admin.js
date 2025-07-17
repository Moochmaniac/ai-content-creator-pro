/**
 * AI Content Creator Pro - Command Center
 * VERSION 2.2
 */
document.addEventListener('DOMContentLoaded', function() {
    const AICP_App = {
        elements: {}, 
        state: { currentView: 'content-creator' },
        versions: { js: '2.2', css: '2.2' }, // Updated version
        contentTree: { /* ... unchanged data structure ... */ },
        init() { /* ... unchanged ... */ },
        cacheDOMElements() { /* ... unchanged ... */ },
        registerEventListeners() { /* ... unchanged ... */ },
        renderView(viewName) { /* ... unchanged ... */ },
        initContentCreator() { /* ... unchanged ... */ },
        populateSelect(selectElement, options) { /* ... unchanged ... */ },
        renderDynamicLayout(templateId) { /* ... unchanged ... */ },
        updateDevStatus() {
            if (!this.elements.devStatusBar) this.elements.devStatusBar = document.getElementById('aicp-dev-status-bar');
            this.elements.devStatusBar.textContent = `AICP v3.2 | JS: v${this.versions.js} | CSS: v${this.versions.css}`;
        },
    };
    AICP_App.init();
});
