import { getMap } from "./map.js";
import { spotlightConfig, getFieldValue } from "./config.js";
import {
    allPins,
    getSpotlightablePins,
    getMultiSpotlightPins,
    resetAllPins,
    filterPinsByDistance,
    filterPinsByMultipleLocations,
} from "./pins.js";

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    spotlightActive: false,
    multiSpotlightActive: false,
    currentLocation: null,
    currentLocations: [],
};

// ============================================================================
// PUBLIC API
// ============================================================================

// Toggle single spotlight for a location
export function toggleSpotlight(location) {
    if (state.multiSpotlightActive) {
        // If multi-spotlight is active, deactivate it first
        deactivateSpotlight();
        activateSingleSpotlight(location);
    } else if (state.spotlightActive && state.currentLocation === location) {
        // Turn off if clicking the same location
        deactivateSpotlight();
    } else {
        // Switch to new location or activate for first time
        if (state.spotlightActive) {
            resetAllPins();
        }
        activateSingleSpotlight(location);
    }
}

// Toggle multi-spotlight mode
export function toggleMultiSpotlight() {
    if (state.multiSpotlightActive) {
        deactivateSpotlight();
    } else {
        activateMultiSpotlight();
    }
}

// Deactivate all spotlight modes
export function deactivateSpotlight() {
    state.spotlightActive = false;
    state.multiSpotlightActive = false;
    state.currentLocation = null;
    state.currentLocations = [];

    OverlayManager.remove();
    resetAllPins();
    updateMultiSpotlightButton(false);
}

// Check if any spotlight mode is active
export function isSpotlightActive() {
    return state.spotlightActive || state.multiSpotlightActive;
}

// ============================================================================
// SPOTLIGHT ACTIVATION
// ============================================================================

// Activate spotlight for a single location
function activateSingleSpotlight(location) {
    state.spotlightActive = true;
    state.multiSpotlightActive = false;
    state.currentLocation = location;
    state.currentLocations = [];

    OverlayManager.createSingle(location);

    // Filter all non-spotlightable pins
    const pinsToFilter = allPins.filter((pin) => !pin.source.spotlightEnabled);
    filterPinsByDistance(location, spotlightConfig.radius, pinsToFilter);
}

// Activate multi-spotlight for all locations
function activateMultiSpotlight() {
    // Deactivate any existing spotlight
    if (state.spotlightActive || state.multiSpotlightActive) {
        deactivateSpotlight();
    }

    // Get all locations from spotlightable pins
    const spotlightPins = getMultiSpotlightPins();
    const locations = spotlightPins.map((pin) => pin.data);

    if (locations.length === 0) {
        console.warn("No locations found for multi-spotlight");
        return;
    }

    state.multiSpotlightActive = true;
    state.spotlightActive = false;
    state.currentLocations = locations;
    state.currentLocation = null;

    OverlayManager.createMulti(locations);

    // Filter all non-spotlightable pins
    const pinsToFilter = allPins.filter((pin) => !pin.source.spotlightEnabled);
    resetAllPins();
    filterPinsByMultipleLocations(
        locations,
        spotlightConfig.radius,
        pinsToFilter
    );

    updateMultiSpotlightButton(true);
}

// ============================================================================
// OVERLAY MANAGER
// ============================================================================

const OverlayManager = {
    overlay: null,

    // Create single spotlight overlay
    createSingle(location) {
        this.remove();

        const map = getMap();
        if (!map) return;

        const lat = getFieldValue(location, ["Latitudine", "latitudine"]);
        const lng = getFieldValue(location, ["Longitudine", "longitudine"]);

        const svg = this._createBaseSVG();
        const { defs, mask } = this._createMask();

        // Add single circle to mask
        const circle = this._createCircle(map, lat, lng);
        mask.appendChild(circle);

        this._finalizeSVG(svg, defs);
        this._attachToMap(svg);
        this._setupMapHandlers();
    },

    // Create multi-spotlight overlay
    createMulti(locations) {
        this.remove();

        const map = getMap();
        if (!map) return;

        const svg = this._createBaseSVG();
        const { defs, mask } = this._createMask();

        // Add circle for each location
        locations.forEach((location) => {
            const lat = getFieldValue(location, ["Latitudine", "latitudine"]);
            const lng = getFieldValue(location, ["Longitudine", "longitudine"]);
            const circle = this._createCircle(map, lat, lng);
            mask.appendChild(circle);
        });

        this._finalizeSVG(svg, defs);
        this._attachToMap(svg);
        this._setupMapHandlers();
    },

    // Update overlay when map moves/zooms
    update() {
        const map = getMap();
        if (!map || !this.overlay) return;

        const mask = this.overlay.querySelector("#spotlight-mask");
        if (!mask) return;

        // Remove existing circles
        const circles = mask.querySelectorAll("circle");
        circles.forEach((circle) => circle.remove());

        // Re-add circles with updated positions
        if (state.multiSpotlightActive && state.currentLocations.length > 0) {
            state.currentLocations.forEach((location) => {
                const lat = getFieldValue(location, [
                    "Latitudine",
                    "latitudine",
                ]);
                const lng = getFieldValue(location, [
                    "Longitudine",
                    "longitudine",
                ]);
                const circle = this._createCircle(map, lat, lng);
                mask.appendChild(circle);
            });
        } else if (state.spotlightActive && state.currentLocation) {
            const lat = getFieldValue(state.currentLocation, [
                "Latitudine",
                "latitudine",
            ]);
            const lng = getFieldValue(state.currentLocation, [
                "Longitudine",
                "longitudine",
            ]);
            const circle = this._createCircle(map, lat, lng);
            mask.appendChild(circle);
        }
    },

    // Remove overlay
    remove() {
        const map = getMap();
        if (map) {
            map.off("move zoom", () => this.update());
        }

        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
    },

    // Private helper methods
    _createBaseSVG() {
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svg.id = "spotlight-overlay";
        svg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: ${spotlightConfig.zIndex};
        `;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        return svg;
    },

    _createMask() {
        const defs = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
        );
        const mask = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "mask"
        );
        mask.id = "spotlight-mask";

        const maskBg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        maskBg.setAttribute("width", "100%");
        maskBg.setAttribute("height", "100%");
        maskBg.setAttribute("fill", "white");

        mask.appendChild(maskBg);
        defs.appendChild(mask);

        return { defs, mask };
    },

    _createCircle(map, lat, lng) {
        const centerPoint = map.latLngToContainerPoint([lat, lng]);
        const radiusInPixels =
            spotlightConfig.radius / 0.075 / Math.pow(2, 20 - map.getZoom());

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        circle.setAttribute("cx", centerPoint.x);
        circle.setAttribute("cy", centerPoint.y);
        circle.setAttribute("r", radiusInPixels);
        circle.setAttribute("fill", "black");
        return circle;
    },

    _finalizeSVG(svg, defs) {
        svg.appendChild(defs);

        const darkRect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        darkRect.setAttribute("width", "100%");
        darkRect.setAttribute("height", "100%");
        darkRect.setAttribute("fill", spotlightConfig.overlayColor);
        darkRect.setAttribute("mask", "url(#spotlight-mask)");

        svg.appendChild(darkRect);
    },

    _attachToMap(svg) {
        const map = getMap();
        if (map) {
            this.overlay = svg;
            map.getContainer().appendChild(this.overlay);
        }
    },

    _setupMapHandlers() {
        const map = getMap();
        if (map) {
            map.on("move zoom", () => this.update());
        }
    },
};

// ============================================================================
// UI HELPERS
// ============================================================================

function updateMultiSpotlightButton(active) {
    const button = document.getElementById("multiSpotlightBtn");
    if (button) {
        if (active) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    }
}
