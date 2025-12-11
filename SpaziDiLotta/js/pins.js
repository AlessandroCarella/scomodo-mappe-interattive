import { createMarkerIcon, addMarkerToMap } from "./map.js";
import { dataSources, getFieldValue } from "./config.js";
import { showLocationInfo, showCustomAlert } from "./ui.js";
import { toggleSpotlight } from "./spotlight.js";

// Store all markers organized by data source
export const pinsBySource = new Map();

// Store all pins in a flat array for easy iteration
export const allPins = [];

// ============================================================================
// INITIALIZATION
// ============================================================================

// Load all data sources
export async function loadAllPins() {
    const loadPromises = dataSources.map((source) =>
        loadPinsFromSource(source)
    );
    await Promise.all(loadPromises);
}

// Load pins from a specific data source
async function loadPinsFromSource(source) {
    try {
        const response = await fetch(source.file);
        if (!response.ok) {
            throw new Error(`Failed to load ${source.file}`);
        }
        const data = await response.json();

        // Initialize storage for this source
        const markers = [];
        pinsBySource.set(source.id, markers);

        // Create markers for each item
        data.forEach((item) => {
            const marker = createPin(item, source);
            if (marker) {
                markers.push(marker);
                allPins.push({ marker, source, data: item });
            }
        });
    } catch (error) {
        console.error(`Error loading pins from ${source.name}:`, error);
        showCustomAlert(
            `Errore nel caricamento dei dati: ${source.name}. Assicurati che il file ${source.file} esista.`,
            "error"
        );
    }
}

// ============================================================================
// PIN CREATION
// ============================================================================

// Create a single pin marker
function createPin(data, source) {
    // Extract coordinates using field configuration
    const lat = getFieldValue(data, source.fields.lat);
    const lng = getFieldValue(data, source.fields.lng);

    if (!lat || !lng) {
        console.warn(`Pin missing coordinates in ${source.name}:`, data);
        return null;
    }

    // Normalize coordinates back to data object
    if (Array.isArray(source.fields.lat)) {
        data[source.fields.lat[0]] = lat;
    }
    if (Array.isArray(source.fields.lng)) {
        data[source.fields.lng[0]] = lng;
    }

    // Create marker icon
    const icon = createMarkerIcon(source.color, source.opacity);

    // Get display name and category
    const name = getFieldValue(data, source.fields.name) || "Unnamed";
    const category =
        getFieldValue(data, source.fields.category) || "Uncategorized";

    // Create marker with zIndexOffset to control stacking order
    const marker = L.marker([lat, lng], {
        icon: icon,
        zIndexOffset: source.zIndexOffset || 0,
    });

    // Only add interactive features if enabled
    if (source.interactiveHover) {
        // Add tooltip on hover
        marker.bindTooltip(`<strong>${name}</strong><br>${category}`, {
            direction: "top",
            offset: [0, -20],
        });
    }
    if (source.interactivePanel) {
        marker.on("click", () => {
            showLocationInfo(data);
            if (source.spotlightEnabled) {
                toggleSpotlight(data);
            }
        });
    }

    // Store metadata on marker
    marker._pinData = data;
    marker._pinSource = source;

    // Add to map
    addMarkerToMap(marker);

    return marker;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Handle pin click
function handlePinClick(data, source) {
    // Show info panel
    showLocationInfo(data);

    // Toggle spotlight if enabled for this source
    if (source.spotlightEnabled) {
        toggleSpotlight(data);
    }
}

// ============================================================================
// PIN MANAGEMENT
// ============================================================================

// Get pins by source ID
export function getPinsBySource(sourceId) {
    return pinsBySource.get(sourceId) || [];
}

// Get all pins that can be spotlighted
export function getSpotlightablePins() {
    return allPins.filter((pin) => pin.source.spotlightEnabled);
}

// Get all pins for multi-spotlight
export function getMultiSpotlightPins() {
    return allPins.filter((pin) => pin.source.showInMultiSpotlight);
}

// Set pin opacity
export function setPinOpacity(marker, opacity) {
    if (marker && marker.setOpacity) {
        marker.setOpacity(opacity);
    }
}

// Set pin interactivity
export function setPinInteractive(marker, interactive) {
    if (marker && marker.getElement()) {
        marker.getElement().style.pointerEvents = interactive ? "auto" : "none";
    }
}

// Reset all pins to their default state
export function resetAllPins() {
    allPins.forEach(({ marker, source }) => {
        setPinOpacity(marker, source.opacity);
        setPinInteractive(marker, true);
    });
}

// Filter pins by distance from a location
export function filterPinsByDistance(location, radius, pinsToFilter) {
    const lat = getFieldValue(location, ["Latitudine", "latitudine"]);
    const lng = getFieldValue(location, ["Longitudine", "longitudine"]);

    pinsToFilter.forEach(({ marker, source }) => {
        const markerLatLng = marker.getLatLng();
        const distance = calculateDistance(
            lat,
            lng,
            markerLatLng.lat,
            markerLatLng.lng
        );

        if (distance > radius) {
            setPinOpacity(marker, 0);
            setPinInteractive(marker, false);
        }
    });
}

// Filter pins by multiple locations (show if within range of ANY location)
export function filterPinsByMultipleLocations(locations, radius, pinsToFilter) {
    pinsToFilter.forEach(({ marker }) => {
        const markerLatLng = marker.getLatLng();

        const isWithinRange = locations.some((location) => {
            const lat = getFieldValue(location, ["Latitudine", "latitudine"]);
            const lng = getFieldValue(location, ["Longitudine", "longitudine"]);
            const distance = calculateDistance(
                lat,
                lng,
                markerLatLng.lat,
                markerLatLng.lng
            );
            return distance <= radius;
        });

        if (!isWithinRange) {
            setPinOpacity(marker, 0);
            setPinInteractive(marker, false);
        }
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Calculate distance between two coordinates in meters using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
