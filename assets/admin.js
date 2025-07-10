/**
 * AI Content Creator Pro Admin Script
 * VERSION 1.1
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Versioning ---
    const SCRIPT_VERSION = '1.1';
    const CSS_VERSION = '1.1'; // Manually sync with CSS file version

    const aicpContentData = {
        "Select a Category...": [],
        "Blog Post": ["Title Ideas", "Outline", "Introduction Paragraph", "Concluding Paragraph", "Full Draft (from title)"],
        "Product Description": ["Feature-to-Benefit Bullets", "Short eCommerce Description", "Full eCommerce Description", "Ad Copy (PPC)"],
        "Marketing Email": ["Subject Line Ideas", "Promotional Email Draft", "Welcome Email Draft"],
        "Social Media Post": ["X (Twitter) - Single Tweet", "X (Twitter) - Tweet Ideas (List)", "X (Twitter) - Thread Starter", "Facebook - Post Ideas (List)", "Facebook - Short Post (Text Only)", "Facebook - Ad Copy", "LinkedIn - Post Ideas (List)", "LinkedIn - Professional Post", "LinkedIn - Article Introduction", "Instagram - Caption Ideas (List)", "Instagram - Photo/Reel Caption", "Instagram - Product Feature Caption"],
        "Tools": ["Keyword Research", "AI Image Generation"]
    };

    function initializeCreatorForm(container) {
        if (!container) return;

        const template = document.getElementById('aicp-ui-form-template');
        if (!template) return;

        container.innerHTML = '';
        const formInstance = template.content.cloneNode(true);
        container.appendChild(formInstance);

        const categorySelect = container.querySelector('.aicp-category-select');
        const formatSelect = container.querySelector('.aicp-format-select');
        const usePersonalityToggle = container.querySelector('.aicp-use-personality-toggle');
        const personalityContainer = container.querySelector('.aicp-personality-input-container');

        Object.keys(aicpContentData).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', function() {
            const formats = aicpContentData[this.value] || [];
            formatSelect.innerHTML = '';
            if (formats.length > 0) {
                formatSelect.disabled = false;
                formatSelect.innerHTML = '<option value="">Select a Format...</option>';
                formats.forEach(format => {
                    const option = document.createElement('option');
                    option.value = format;
                    option.textContent = format;
                    formatSelect.appendChild(option);
                });
            } else {
                formatSelect.disabled = true;
                formatSelect.innerHTML = '<option value="">Select a category first...</option>';
            }
        });
        
        if (usePersonalityToggle && personalityContainer) {
            usePersonalityToggle.addEventListener('change', function() {
                personalityContainer.classList.toggle('aicp-visible', this.checked);
            });
        }
    }
    
    // --- Initialize Core UI and Logic ---
    const adminBarButton = document.getElementById('aicp-admin-bar-button');
    const floatingPanel = document.getElementById('aicp-floating-panel');
    if (adminBarButton && floatingPanel) {
        const closeButton = floatingPanel.querySelector('.aicp-close-button');
        function togglePanel(event) {
            if (event) event.preventDefault();
            floatingPanel.classList.toggle('aicp-panel-visible');
        }
        adminBarButton.addEventListener('click', togglePanel);
        closeButton.addEventListener('click', togglePanel);
    }
    
    const panelBody = floatingPanel.querySelector('.aicp-panel-body');
    const metaBoxBody = document.querySelector('.sim-postbox .inside');
    initializeCreatorForm(panelBody);
    initializeCreatorForm(metaBoxBody);

    // --- NEW: Populate Development Status Bar ---
    const devStatusBar = document.getElementById('aicp-dev-status-bar');
    if (devStatusBar) {
        devStatusBar.textContent = `JS: v${SCRIPT_VERSION} | CSS: v${CSS_VERSION}`;
    }
});
