import { formatOrariApertura } from "./utils.js";

// Show location info in side panel (generic version)
export function showLocationInfo(location, config) {
    const panel = document.getElementById("infoPanel");
    const nameEl = document.getElementById("locationName");
    const categoryEl = document.getElementById("locationCategory");
    const contentEl = document.getElementById("infoPanelContent");

    // Get name and category using config fields
    const name = location[config.nameField] || "Unknown";
    const category = location[config.categoryField] || "Uncategorized";

    // Set header information
    nameEl.textContent = name;
    categoryEl.textContent = category;
    categoryEl.style.backgroundColor = config.color;

    // Build content with all available properties
    let content = "";

    // Fields to exclude from display (already shown in header or are coordinates)
    const excludeKeys = [
        config.nameField,
        config.categoryField,
        config.latField,
        config.lngField,
        "lat",
        "lng",
        "lon",
    ];

    Object.keys(location).forEach((key) => {
        if (!excludeKeys.includes(key)) {
            const value = location[key];
            if (value !== null && value !== undefined && value !== "") {
                let displayValue = value;

                // Special formatting for "orari apertura"
                if (key === "orari apertura" && typeof value === "object") {
                    displayValue = formatOrariApertura(value);
                } else if (
                    typeof value === "string" &&
                    (value.startsWith("http://") ||
                        value.startsWith("https://"))
                ) {
                    // Format URLs as links
                    displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                } else if (typeof value === "object") {
                    // Stringify objects
                    displayValue = JSON.stringify(value, null, 2);
                }

                content += `
                    <div class="info-row">
                        <div class="info-label">${key}</div>
                        <div class="info-value">${displayValue}</div>
                    </div>
                `;
            }
        }
    });

    // Add coordinates
    const lat = location[config.latField];
    const lng = location[config.lngField];

    if (lat && lng) {
        content += `
            <div class="info-row">
                <div class="info-label">Coordinates</div>
                <div class="info-value">${Number(lat).toFixed(6)}, ${Number(
            lng
        ).toFixed(6)}</div>
            </div>
        `;
    }

    contentEl.innerHTML =
        content ||
        '<p style="color: #999;">No additional information available.</p>';

    // Show the panel with slide animation
    panel.style.display = "block";
    panel.offsetHeight; // Force reflow
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

// Custom alert function
export function showCustomAlert(message, type = "success") {
    // Create alert overlay if it doesn't exist
    let overlay = document.getElementById("customAlertOverlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "customAlertOverlay";
        overlay.className = "custom-alert-overlay";
        overlay.innerHTML = `
            <div class="custom-alert">
                <div class="custom-alert-icon" id="customAlertIcon"></div>
                <div class="custom-alert-message" id="customAlertMessage"></div>
                <button class="custom-alert-close" onclick="this.parentElement.parentElement.classList.remove('visible')">OK</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }

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

    // Auto-hide after 5 seconds
    setTimeout(() => {
        overlay.classList.remove("visible");
    }, 5000);
}
