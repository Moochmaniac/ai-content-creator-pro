/**
 * AI Content Creator Pro Admin Script
 *
 * Handles interactivity for the plugin's UI components.
 */

// Wait for the DOM to be fully loaded before running our script.
// This is a crucial best practice.
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Get references to our key HTML elements ---
    const adminBarButton = document.getElementById('aicp-admin-bar-button');
    const floatingPanel = document.getElementById('aicp-floating-panel');
    const closeButton = document.querySelector('#aicp-floating-panel .aicp-close-button');

    // --- 2. Safety Check ---
    // If any of our essential elements don't exist on the page, stop the script
    // to prevent errors. This protects against issues if another plugin
    // or theme changes the page structure unexpectedly.
    if (!adminBarButton || !floatingPanel || !closeButton) {
        console.error('AICP Error: Could not find one or more required UI elements for the floating panel.');
        return; // Exit the function
    }

    // --- 3. Define our main function ---
    function togglePanel(event) {
        // This is the fix for our original critical blocker. It prevents
        // the link's default behavior (jumping to the top of the page).
        if (event) {
            event.preventDefault();
        }
        // This single line adds or removes the 'aicp-panel-visible' class on the
        // floating panel. The CSS handles the actual animation.
        floatingPanel.classList.toggle('aicp-panel-visible');
    }

    // --- 4. Attach the event listeners ---
    // When the admin bar button is clicked, run our togglePanel function.
    adminBarButton.addEventListener('click', togglePanel);

    // When the close button is clicked, also run our togglePanel function.
    closeButton.addEventListener('click', togglePanel);

});
