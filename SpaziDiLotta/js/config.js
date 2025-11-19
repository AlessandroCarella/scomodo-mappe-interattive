// ============================================================================
// MAP CONFIGURATION
// ============================================================================
export const mapPngAddress =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png";

export const mapConfig = {
    center: {
        lat: 41.117982061313434,
        lng: 16.86761994470451,
    },
    zoom: 12,
    minZoom: 6,
    maxZoom: 19,
    tileLayer:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
    polygonFile: "resources/bariCoordinates.json",
    polygonStyle: {
        color: "#000000",
        weight: 2,
        fillOpacity: 0,
    },
};

// ============================================================================
// DATA SOURCES CONFIGURATION
// ============================================================================

export const dataSources = [
    {
        id: "spazi",
        name: "Spazi di Aggregazione",
        file: "resources/SpaziDiLotta.json",
        color: "#9b3642",
        opacity: 1.0,
        defaultView: "pins", // 'pins', 'heatmap', or 'none'
        zIndexOffset: 1000,
        spotlightEnabled: true, // Can be spotlighted
        showInMultiSpotlight: true, // Included in "Tutti gli Spazi"
        fields: {
            name: "Spazio",
            category: "Categoria",
            lat: "Latitudine",
            lng: "Longitudine",
        },
    },
    {
        id: "SpaziDiConsumo",
        name: "Spazi di Consumo",
        file: "resources/SpaziDiConsumo.json",
        color: "#808080",
        opacity: 0.7,
        defaultView: "pins",
        zIndexOffset: 500,
        spotlightEnabled: false, // Cannot be spotlighted (only filtered)
        showInMultiSpotlight: false,
        fields: {
            name: "Spazio",
            category: "Categoria",
            lat: ["Latitudine", "latitudine"], // Can handle multiple field names
            lng: ["Longitudine", "longitudine"],
        },
    },
];

// ============================================================================
// SPOTLIGHT CONFIGURATION
// ============================================================================

export const spotlightConfig = {
    radius: 150, // meters
    overlayOpacity: 0.7,
    overlayColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 400,
};

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export const uiConfig = {
    multiSpotlightButton: {
        text: "Tutti gli Spazi",
        position: { top: 20, left: 20 },
    },
    infoPanel: {
        width: 400,
        excludeFields: ["latitudine", "longitudine"], // Fields to exclude from display (case-insensitive)
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get a data source by ID
export function getDataSource(id) {
    return dataSources.find((source) => source.id === id);
}

// Get all data sources that can be spotlighted
export function getSpotlightableSources() {
    return dataSources.filter((source) => source.spotlightEnabled);
}

// Get all data sources for multi-spotlight
export function getMultiSpotlightSources() {
    return dataSources.filter((source) => source.showInMultiSpotlight);
}

// Get field value from object, handling multiple possible field names
export function getFieldValue(obj, fieldConfig) {
    if (Array.isArray(fieldConfig)) {
        // Try each field name until we find a value
        for (const fieldName of fieldConfig) {
            const value = obj[fieldName];
            if (value !== undefined && value !== null) {
                return value;
            }
        }
        return null;
    }
    return obj[fieldConfig];
}
