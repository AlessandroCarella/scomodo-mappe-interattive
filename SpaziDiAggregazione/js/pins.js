import {
    createMarkerIcon,
    addMarkerToMap,
    removeMarkerFromMap,
} from "./map.js";
import { showLocationInfo } from "./ui.js";

// Store all pin instances by source id
const pinInstances = new Map();

export class PinLayer {
    constructor(sourceId, config) {
        this.sourceId = sourceId;
        this.config = config;
        this.markers = [];
        this.isVisible = false;

        pinInstances.set(sourceId, this);
    }

    // Create markers from data
    createMarkers(data) {
        const icon = createMarkerIcon(this.config.color);

        data.forEach((item) => {
            const lat = item[this.config.latField];
            const lng = item[this.config.lngField];

            if (!lat || !lng) {
                console.warn(
                    `Skipping item without coordinates in ${this.sourceId}:`,
                    item
                );
                return;
            }

            const name = item[this.config.nameField] || "Unknown";
            const category = item[this.config.categoryField] || "Uncategorized";

            const marker = L.marker([lat, lng], {
                icon: icon,
                zIndexOffset: this.config.zIndexOffset || 0,
            });

            // Only add interactive features if enabled
            if (this.config.interactiveHover) {
                // Add tooltip on hover
                marker.bindTooltip(`<strong>${name}</strong>`/*<br>${category}`*/, {
                    direction: "top",
                    offset: [0, -20],
                });
            }
            if (this.config.interactivePanel) {
                // Add click event to show info panel
                marker.on("click", () => {
                    showLocationInfo(item, this.config);
                });
            }

            marker.locationData = item;
            marker.sourceId = this.sourceId;

            this.markers.push(marker);
        });
    }

    // Show all markers
    show() {
        this.markers.forEach((marker) => {
            addMarkerToMap(marker);
        });
        this.isVisible = true;
    }

    // Hide all markers
    hide() {
        this.markers.forEach((marker) => {
            removeMarkerFromMap(marker);
        });
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

    // Get marker count
    getMarkerCount() {
        return this.markers.length;
    }

    // Clear all markers
    clear() {
        this.hide();
        this.markers = [];
    }
}

// Get pin instance by source id
export function getPinInstance(sourceId) {
    return pinInstances.get(sourceId);
}
