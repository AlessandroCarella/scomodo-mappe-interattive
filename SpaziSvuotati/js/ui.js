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
