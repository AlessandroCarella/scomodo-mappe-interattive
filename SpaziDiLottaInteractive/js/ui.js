import { uiConfig, getFieldValue } from "./config.js";

// ============================================================================
// INFO PANEL
// ============================================================================

// Show location info in side panel
export function showLocationInfo(location) {
    const panel = document.getElementById("infoPanel");
    const nameEl = document.getElementById("locationName");
    const categoryEl = document.getElementById("locationCategory");
    const contentEl = document.getElementById("infoPanelContent");

    // Set header information
    const name =
        getFieldValue(location, ["Spazio", "name"]) || "Posto sconosciuto";
    const category =
        getFieldValue(location, ["Categoria", "category"]) ||
        "Non categorizzato";

    nameEl.textContent = name;
    categoryEl.textContent = category;

    // Build content with all available properties
    const content = buildInfoContent(location);
    contentEl.innerHTML = content;

    // Show the panel with slide animation
    showPanel(panel);
}

// Build info content HTML
function buildInfoContent(location) {
    let content = "";

    // Get fields to exclude (case-insensitive)
    const excludeFields = [
        "Latitudine",
        "Longitudine",
        "Spazio",
        "Categoria",
        "name",
        "category",
        ...uiConfig.infoPanel.excludeFields,
    ];

    const excludeFieldsLower = excludeFields.map((f) => f.toLowerCase());

    // Display all properties except excluded fields
    Object.keys(location).forEach((key) => {
        if (!excludeFieldsLower.includes(key.toLowerCase())) {
            const value = location[key];
            if (value !== null && value !== undefined && value !== "") {
                content += createInfoRow(key, value);
            }
        }
    });

    // Add coordinates
    const lat = getFieldValue(location, ["Latitudine", "latitudine"]);
    const lng = getFieldValue(location, ["Longitudine", "longitudine"]);

    if (lat && lng) {
        content += `
            <div class="info-row">
                <div class="info-label">Coordinate</div>
                <div class="info-value">${lat.toFixed(6)}, ${lng.toFixed(
            6
        )}</div>
            </div>
        `;
    }

    return (
        content ||
        '<p style="color: #999;">Nessuna informazione aggiuntiva disponibile.</p>'
    );
}

// Create a single info row
function createInfoRow(key, value) {
    let displayValue = value;

    // Check if value is a URL
    if (
        typeof value === "string" &&
        (value.startsWith("http://") || value.startsWith("https://"))
    ) {
        displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
    } else if (typeof value === "object") {
        // For objects, stringify them
        displayValue = `<pre>${JSON.stringify(value, null, 2)}</pre>`;
    }

    return `
        <div class="info-row">
            <div class="info-label">${key}</div>
            <div class="info-value">${displayValue}</div>
        </div>
    `;
}

// Show panel with animation
function showPanel(panel) {
    panel.style.display = "block";
    // Force reflow to ensure display change is applied before animation
    panel.offsetHeight;
    // Trigger slide animation
    requestAnimationFrame(() => {
        panel.classList.add("visible");
    });
}

// Close info panel
export function closeInfoPanel() {
    const panel = document.getElementById("infoPanel");
    panel.classList.remove("visible");

    // Hide panel after transition completes
    setTimeout(() => {
        if (!panel.classList.contains("visible")) {
            panel.style.display = "none";
        }
    }, 300); // Match transition duration
}

// ============================================================================
// CUSTOM ALERT
// ============================================================================

// Show custom alert
export function showCustomAlert(message, type = "success") {
    const overlay = document.getElementById("customAlertOverlay");
    const icon = document.getElementById("customAlertIcon");
    const messageEl = document.getElementById("customAlertMessage");

    // Set icon based on type
    if (type === "success") {
        icon.textContent = "✓";
        icon.className = "custom-alert-icon success";
    } else {
        icon.textContent = "✗";
        icon.className = "custom-alert-icon error";
    }

    messageEl.textContent = message;
    overlay.classList.add("visible");
}

// Close custom alert
export function closeCustomAlert() {
    const overlay = document.getElementById("customAlertOverlay");
    overlay.classList.remove("visible");
}
