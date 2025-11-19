import { dataSources } from "./config.js";
import { PinLayer } from "./pins.js";
import { HeatmapLayer } from "./heatmap.js";
import { showCustomAlert } from "./ui.js";

// Store loaded data and layers
const dataStore = new Map();
const pinLayers = new Map();
const heatmapLayers = new Map();
const currentViews = new Map(); // Track current view for each source

// Initialize all data sources
export async function initializeDataSources() {
    const promises = dataSources.map((source) => loadDataSource(source));
    await Promise.all(promises);
}

// Load a single data source
async function loadDataSource(source) {
    try {
        const response = await fetch(source.file);
        if (!response.ok) {
            throw new Error(`Failed to load ${source.file}`);
        }
        const data = await response.json();

        // Store the data
        dataStore.set(source.id, data);

        // Create pin layer
        const pinLayer = new PinLayer(source.id, source);
        pinLayer.createMarkers(data);
        pinLayers.set(source.id, pinLayer);

        // Create heatmap layer
        const heatmapLayer = new HeatmapLayer(source.id, source);
        heatmapLayer.createHeatmap(data);
        heatmapLayers.set(source.id, heatmapLayer);

        // Set initial view based on default
        setView(source.id, source.defaultView);
    } catch (error) {
        console.error(`Error loading ${source.name}:`, error);
        showCustomAlert(
            `Errore nel caricamento di ${source.name}. Verifica che il file ${source.file} esista.`,
            "error"
        );
    }
}

// Set view for a data source
export function setView(sourceId, view) {
    const pinLayer = pinLayers.get(sourceId);
    const heatmapLayer = heatmapLayers.get(sourceId);

    if (!pinLayer || !heatmapLayer) {
        console.warn(`No layers found for source: ${sourceId}`);
        return;
    }

    // Hide both first
    pinLayer.hide();
    heatmapLayer.hide();

    // Show the selected view
    switch (view) {
        case "pins":
            pinLayer.show();
            break;
        case "heatmap":
            heatmapLayer.show();
            break;
        case "none":
            // Both already hidden
            break;
        default:
            console.warn(`Unknown view type: ${view}`);
    }

    currentViews.set(sourceId, view);
}

// Get current view for a source
export function getCurrentView(sourceId) {
    return currentViews.get(sourceId) || "none";
}

// Get data for a source
export function getData(sourceId) {
    return dataStore.get(sourceId);
}

// Get pin layer for a source
export function getPinLayer(sourceId) {
    return pinLayers.get(sourceId);
}

// Get heatmap layer for a source
export function getHeatmapLayer(sourceId) {
    return heatmapLayers.get(sourceId);
}

// Get all sources
export function getAllSources() {
    return dataSources;
}
