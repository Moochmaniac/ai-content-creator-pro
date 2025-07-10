/* --- AI Content Creator Pro - Main Styles --- */

/* =================================================== */
/* 1. FLOATING PANEL                                   */
/* =================================================== */
#aicp-floating-panel {
    position: fixed;
    top: 50px;
    right: 20px;
    width: 400px;
    max-width: 90%;
    z-index: 99999;
    background-color: #ffffff;
    border: 1px solid #c3c4c7;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border-radius: 4px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out, visibility 0.2s;
}
#aicp-floating-panel.aicp-panel-visible {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
}
.aicp-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    background-color: #f6f7f7;
}
.aicp-panel-header h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    padding: 0;
    color: #1d2327;
}
.aicp-close-button {
    background: none;
    border: none;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    color: #50575e;
    padding: 0 4px;
}
.aicp-close-button:hover { color: #007cba; }
.aicp-panel-body {
    padding: 16px;
    max-height: 70vh;
    overflow-y: auto;
}
.aicp-panel-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #ddd;
    background-color: #f6f7f7;
}

/* =================================================== */
/* 2. FORM ELEMENTS                                    */
/* =================================================== */
.aicp-form-row {
    margin-bottom: 12px;
}
.aicp-form-row:last-child {
    margin-bottom: 0;
}
.aicp-form-row label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
}
.aicp-form-row select,
.aicp-form-row textarea {
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
}
.aicp-form-row textarea {
    min-height: 80px;
}

/* === NEW: Styles for the personality container === */
.aicp-personality-input-container {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out, margin-top 0.3s ease-in-out;
    margin-top: 0;
    /* Remove bottom margin from the form row inside it to prevent double-spacing */
    .aicp-form-row {
        margin-bottom: 0;
    }
}
.aicp-personality-input-container.aicp-visible {
    max-height: 120px; /* Ample height for textarea + label + margin */
    opacity: 1;
    margin-top: -4px; /* Adjust to look good with the checkbox row above */
    margin-bottom: 12px;
}
/* =============================================== */

/* =================================================== */
/* 3. SHARED UI ELEMENTS (Buttons, etc.)               */
/* =================================================== */
.aicp-button-primary, .aicp-button-secondary {
    padding: 6px 14px;
    font-size: 13px;
    line-height: normal;
    height: auto;
    cursor: pointer;
    border-radius: 3px;
    border-width: 1px;
    border-style: solid;
}
.aicp-button-primary {
    background: #007cba;
    border-color: #007cba;
    color: #fff;
    margin-left: 8px;
}
.aicp-button-primary:hover { background: #0071a1; border-color: #0071a1; }
.aicp-button-secondary {
    background: #f6f7f7;
    border-color: #c3c4c7;
    color: #50575e;
}
.aicp-button-secondary:hover { background: #f0f0f1; border-color: #8c8f94; color: #222; }
