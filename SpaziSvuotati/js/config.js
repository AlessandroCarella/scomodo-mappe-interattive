// Configuration for all data sources
export const dataSources = [
    {
        id: "spazi",
        name: "Spazi Svuotati",
        file: "resources/BandBbari.json",
        color: "#bababa",
        defaultView: "heatmap", // 'pins', 'heatmap', or 'none'
        zIndexOffset: 1000,
        nameField: "spazio",
        categoryField: "Categoria",
        latField: "latitudine",
        lngField: "longitudine",
    }
];

// Heatmap configuration
export const heatmapConfig = {
    radius: 13,
    blur: 15,
    maxZoom: 17,
    max: 0.1,
    gradient: {
        0.0: "blue",
        0.3: "cyan",
        0.5: "lime",
        0.7: "yellow",
        1.0: "red",
    },
};
