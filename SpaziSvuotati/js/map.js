import { calculatePolygonCenter } from "./utils.js";

let map = null;
let polygonLayer = null;

// Function to create custom marker icon
export function createMarkerIcon(color, opacity = 1) {
    return L.divIcon({
        className: "custom-marker",
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" opacity="${opacity}">
            <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
            <circle cx="12" cy="12" r="4" fill="#fff" opacity="0.9"/>
        </svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -12],
        tooltipAnchor: [0, -12],
    });
}

// Load polygon coordinates and calculate center
async function loadPolygonData() {
    try {
        const response = await fetch("resources/bariCoordinates.json");
        if (!response.ok) {
            console.warn(
                "Failed to load bariCoordinates.json, using default center"
            );
            return {
                center: { lat: 41.117982061313434, lng: 16.86761994470451 },
                coordinates: null,
            };
        }
        const coordinates = await response.json();
        const center = calculatePolygonCenter(coordinates);
        return {
            center: center || {
                lat: 41.117982061313434,
                lng: 16.86761994470451,
            },
            coordinates: coordinates,
        };
    } catch (error) {
        console.warn("Error loading bariCoordinates.json:", error);
        return {
            center: { lat: 41.117982061313434, lng: 16.86761994470451 },
            coordinates: null,
        };
    }
}

// Draw polygon outline on the map
function drawPolygonOutline(coordinates) {
    if (!map || !coordinates) return;

    // Remove existing polygon if any
    if (polygonLayer) {
        map.removeLayer(polygonLayer);
    }

    // Create polygon with black outline and no fill
    polygonLayer = L.polygon(coordinates, {
        color: "#000000",
        weight: 2,
        fillOpacity: 0,
        interactive: false,
    });

    polygonLayer.addTo(map);
}

// Get responsive map settings based on screen size
function getResponsiveMapSettings() {
    const width = window.innerWidth;

    // Define breakpoints and settings
    if (width < 576) {
        // Mobile (small phones)
        return {
            zoom: 10,
            center: [41.002982061313434, 16.86761994470451],
        };
    } else if (width < 768) {
        // Mobile (larger phones)
        return {
            zoom: 11,
            center: [41.092982061313434, 16.86761994470451],
        };
    } else if (width < 1600) {
        // Tablet
        return {
            zoom: 12,
            center: [41.092982061313434, 16.86761994470451],
        };
    } else {
        // Desktop
        return {
            zoom: 13,
            center: [41.092982061313434, 16.86761994470451],
        };
    }
}

// Initialize the map centered on Italy
export async function initializeMap() {
    const { center, coordinates } = await loadPolygonData();
    const settings = getResponsiveMapSettings();
    const mapPngAddress =
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png";

    map = L.map("map", {
        zoomControl: false,
        scrollWheelZoom: true,
    }).setView(settings.center, settings.zoom);

    // Add map tiles
    L.tileLayer(mapPngAddress, {
        maxZoom: 19,
        minZoom: 6,
    }).addTo(map);

    drawPolygonOutline(coordinates);

    // Optional: Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            map.invalidateSize();
            // Optionally adjust zoom on resize
            // const newSettings = getResponsiveMapSettings();
            // map.setView(newSettings.center, newSettings.zoom);
        }, 250);
    });

    return map;
}

// Get map instance
export function getMap() {
    return map;
}

// Add marker to map
export function addMarkerToMap(marker) {
    if (map) {
        marker.addTo(map);
    }
}

// Remove marker from map
export function removeMarkerFromMap(marker) {
    if (map) {
        map.removeLayer(marker);
    }
}
