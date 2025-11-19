// Configuration for all data sources
export const dataSources = [
    {
        id: "spazi",
        name: "Spazi di Aggregazione",
        file: "resources/SpaziDiAggregazione.json",
        color: "#356854",
        defaultView: "pins", // 'pins', 'heatmap', or 'none'
        zIndexOffset: 1000,
        nameField: "Spazio",
        categoryField: "Categoria",
        latField: "Latitudine",
        lngField: "Longitudine",
    },
    {
        id: "questionario",
        name: "Questionario",
        file: "resources/questionario.json",
        color: "#4daf4a",
        defaultView: "none", // 'pins', 'heatmap', or 'none'
        zIndexOffset: 750,
        nameField: "name",
        categoryField: "Categoria",
        latField: "Latitudine",
        lngField: "Longitudine",
    },
    {
        id: "SpaziDiConsumo",
        name: "Spazi di Consumo",
        file: "resources/SpaziDiConsumo.json",
        color: "#fb8072",
        defaultView: "heatmap", // 'pins', 'heatmap', or 'none'
        zIndexOffset: 500,
        nameField: "Spazio",
        categoryField: "Categoria",
        latField: "latitudine",
        lngField: "longitudine",
    },
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
