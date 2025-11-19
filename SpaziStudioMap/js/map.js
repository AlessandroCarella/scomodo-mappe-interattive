let map = null;
let polygonLayer = null;

// Function to create custom marker icon
export function createMarkerIcon(color, opacity = 1) {
    return L.divIcon({
        className: "custom-marker",
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41" opacity="${opacity}">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.4 12.5 28.5 12.5 28.5S25 20.9 25 12.5C25 5.6 19.4 0 12.5 0z" 
                  fill="${color}" stroke="#fff" stroke-width="1.5"/>
            <circle cx="12.5" cy="12.5" r="5" fill="#fff" opacity="0.9"/>
        </svg>`,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
        tooltipAnchor: [0, -30],
    });
}

function calculatePolygonCenter(coordinates) {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    let sumLat = 0;
    let sumLng = 0;

    coordinates.forEach((coord) => {
        sumLat += coord[0];
        sumLng += coord[1];
    });

    return {
        lat: sumLat / coordinates.length,
        lng: sumLng / coordinates.length,
    };
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
            center: [41.092982061313434, 16.86761994470451],
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
