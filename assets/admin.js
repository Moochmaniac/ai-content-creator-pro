/**
 * AI Content Creator Pro Admin Script
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- Data Structure for our conditional dropdowns ---
    const aicpContentData = {
        "Select a Category...": [],
        "Blog Post": [
            "Title Ideas",
            "Outline",
            "Introduction Paragraph",
            "Concluding Paragraph",
            "Full Draft (from title)"
        ],
        "Product Description": [
            "Feature-to-Benefit Bullets",
            "Short eCommerce Description",
            "Full eCommerce Description",
            "Ad Copy (PPC)"
        ],
        "Marketing Email": [
            "Subject Line Ideas",
            "Promotional Email Draft",
            "Welcome Email Draft"
        ],
        "Social Media Post": [
            "X (Twitter) - Single Tweet",
            "X (Twitter) - Tweet Ideas (List)",
            "X (Twitter) - Thread Starter",
            "Facebook - Post Ideas (List)",
            "Facebook - Short Post (Text Only)",
            "Facebook - Ad Copy",
            "LinkedIn - Post Ideas (List)",
            "LinkedIn - Professional Post",
            "LinkedIn - Article Introduction",
            "Instagram - Caption Ideas (List)",
            "Instagram - Photo/Reel Caption",
            "Instagram - Product Feature Caption"
        ],
        "Tools": [
            "Keyword Research",
            "AI Image Generation"
        ]
    };

    /**
     * Initializes a single instance of the AI Creator form.
     * @param {HTMLElement} container - The element to build the form inside.
     */
    function initializeCreatorForm(container) {
        if (!container) return;

        const template = document.getElementById('aicp-ui-form-template');
        if (!template) {
            console.error('AICP Error: UI Form Template not found!');
            return;
        }

        // Clone the template and append it to the container
        const formInstance = template.content.cloneNode(true);
        container.appendChild(formInstance);

        // Get references to the new form elements within this specific container
        const categorySelect = container.querySelector('.aicp-category-select');
        const formatSelect = container.querySelector('.aicp-format-select');

        // Populate the Category dropdown
        for (const category in aicpContentData) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }

        // Add an event listener to the Category dropdown
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            const formats = aicpContentData[selectedCategory] || [];

            // Clear previous format options
            formatSelect.innerHTML = '';

            if (formats.length > 0) {
                // Enable the format dropdown
                formatSelect.disabled = false;
                // Add the default prompt
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select a Format...';
                formatSelect.appendChild(defaultOption);
                // Populate with new options
                formats.forEach(format => {
                    const option = document.createElement('option');
                    option.value = format;
                    option.textContent = format;
                    formatSelect.appendChild(option);
                });
            } else {
                // Disable if no category is selected
                formatSelect.disabled = true;
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'Select a category first...';
                formatSelect.appendChild(option);
            }
        });
    }

    // --- Initialize Panel Toggle Logic ---
    const adminBarButton = document.getElementById('aicp-admin-bar-button');
    const floatingPanel = document.getElementById('aicp-floating-panel');
    const closeButton = floatingPanel.querySelector('.aicp-close-button');

    if (adminBarButton && floatingPanel && closeButton) {
        function togglePanel(event) {
            if (event) event.preventDefault();
            floatingPanel.classList.toggle('aicp-panel-visible');
        }
        adminBarButton.addEventListener('click', togglePanel);
        closeButton.addEventListener('click', togglePanel);
    } else {
        console.error('AICP Error: Could not find one or more required UI elements for the floating panel.');
    }
    
    // --- Initialize the UI in both locations ---
    const panelBody = floatingPanel.querySelector('.aicp-panel-body');
    const metaBoxBody = document.querySelector('.sim-postbox .inside');

    initializeCreatorForm(panelBody);
    initializeCreatorForm(metaBoxBody);

});
