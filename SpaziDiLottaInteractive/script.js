import { initializeMap, getMap } from "./js/map.js";
import { loadAllPins } from "./js/pins.js";
import { closeInfoPanel, closeCustomAlert } from "./js/ui.js";
import {
    deactivateSpotlight,
    isSpotlightActive,
    toggleMultiSpotlight,
} from "./js/spotlight.js";

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Initialize map
        await initializeMap();

        // Load all pins from configured data sources
        await loadAllPins();

        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error("Error initializing application:", error);
    }
});

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    setupInfoPanelListeners();
    setupCustomAlertListeners();
    setupMultiSpotlightListeners();
    setupMapListeners();
    setupKeyboardListeners();
}

// Info panel event listeners
function setupInfoPanelListeners() {
    const closePanelBtn = document.getElementById("closePanelBtn");
    if (closePanelBtn) {
        closePanelBtn.addEventListener("click", closeInfoPanel);
    }
}

// Custom alert event listeners
function setupCustomAlertListeners() {
    const customAlertBtn = document.getElementById("customAlertBtn");
    const customAlertOverlay = document.getElementById("customAlertOverlay");

    if (customAlertBtn) {
        customAlertBtn.addEventListener("click", closeCustomAlert);
    }

    if (customAlertOverlay) {
        customAlertOverlay.addEventListener("click", (e) => {
            if (e.target.id === "customAlertOverlay") {
                closeCustomAlert();
            }
        });
    }
}

// Multi-spotlight button event listeners
function setupMultiSpotlightListeners() {
    const multiSpotlightBtn = document.getElementById("multiSpotlightBtn");
    if (multiSpotlightBtn) {
        multiSpotlightBtn.addEventListener("click", () => {
            toggleMultiSpotlight();
        });
    }
}

// Map click event listeners
function setupMapListeners() {
    const map = getMap();
    if (!map) return;

    map.on("click", (e) => {
        // Deactivate spotlight when clicking on the map itself (not on markers)
        if (
            isSpotlightActive() &&
            e.originalEvent.target === map.getContainer()
        ) {
            deactivateSpotlight();
        }
    });
}

// Keyboard event listeners
function setupKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (isSpotlightActive()) {
                deactivateSpotlight();
            }
            closeInfoPanel();
        }
    });
}
