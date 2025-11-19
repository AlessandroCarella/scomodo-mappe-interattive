import { getMap } from "./map.js";
import { heatmapConfig } from "./config.js";

// Store all heatmap instances by source id
const heatmapInstances = new Map();

export class HeatmapLayer {
    constructor(sourceId, config) {
        this.sourceId = sourceId;
        this.config = config;
        this.layer = null;
        this.data = [];
        this.isVisible = false;

        heatmapInstances.set(sourceId, this);
    }

    // Create heatmap from data
    createHeatmap(data) {
        // Convert data to heatmap format [lat, lng, intensity]
        this.data = data
            .map((item) => {
                const lat = item[this.config.latField];
                const lng = item[this.config.lngField];

                if (!lat || !lng) {
                    return null;
                }

                return [lat, lng, 1]; // Default intensity of 1
            })
            .filter((point) => point !== null);

        if (this.data.length === 0) {
            console.warn(
                `No valid data points for heatmap in ${this.sourceId}`
            );
            return;
        }

        // Create the heatmap layer
        const map = getMap();
        if (!map) {
            console.error("Map not initialized");
            return;
        }

        this.layer = L.heatLayer(this.data, {
            ...heatmapConfig,
            gradient: this.createGradient(this.config.color),
        });
    }

    // Create a gradient based on the source color
    createGradient(color) {
        // Use default gradient but can be customized per source
        return heatmapConfig.gradient;
    }

    // Show heatmap
    show() {
        const map = getMap();
        if (!map || !this.layer) {
            console.warn(
                `Cannot show heatmap for ${this.sourceId}: map or layer not initialized`
            );
            return;
        }

        this.layer.addTo(map);
        this.isVisible = true;
    }

    // Hide heatmap
    hide() {
        const map = getMap();
        if (!map || !this.layer) return;

        map.removeLayer(this.layer);
        this.isVisible = false;
    }

    // Toggle visibility
    toggle(show) {
        if (show) {
            this.show();
        } else {
            this.hide();
        }
    }

    // Get data point count
    getDataCount() {
        return this.data.length;
    }

    // Clear heatmap
    clear() {
        this.hide();
        this.layer = null;
        this.data = [];
    }
}

// Get heatmap instance by source id
export function getHeatmapInstance(sourceId) {
    return heatmapInstances.get(sourceId);
}
