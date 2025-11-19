import { initializeMap } from "./js/map.js";
import { initializeDataSources } from "./js/dataManager.js";
import { createControls } from "./js/uiManager.js";
import { closeInfoPanel } from "./js/ui.js";

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize map first and WAIT for it to complete
    await initializeMap();

    // Load all data sources and create layers
    await initializeDataSources();

    // Create UI controls dynamically
    createControls();

    // Set up close panel button
    const closePanelBtn = document.getElementById("closePanelBtn");
    if (closePanelBtn) {
        closePanelBtn.addEventListener("click", closeInfoPanel);
    }
});
