import { initializeMap } from "./js/map.js";
import { initializeDataSources } from "./js/dataManager.js";
import { createControls } from "./js/uiManager.js";

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize map first and WAIT for it to complete
    await initializeMap();

    // Load all data sources and create layers
    await initializeDataSources();

    // Create UI controls dynamically
    createControls();
});
