import { markers } from './locations.js';
import { addMarkerToMap, removeMarkerFromMap } from './map.js';
import { isLocationOpen } from './utils.js';

// Track global "show only open" filter state
let showOnlyOpen = false;
let selectedDay = null;
let selectedHour = null;

export function updateTimeFilter(day, hour, onlyOpen) {
    selectedDay = day;
    selectedHour = hour;
    showOnlyOpen = onlyOpen;
    
    // Apply filter to all markers
    applyTimeFilter();
}

// Apply time filter to all markers
function applyTimeFilter() {
    markers.forEach((marker) => {
        if (showOnlyOpen) {
            // Only show if location is open at selected time
            if (marker.locationData && isLocationOpen(marker.locationData, selectedDay, selectedHour)) {
                addMarkerToMap(marker);
            } else {
                removeMarkerFromMap(marker);
            }
        } else {
            // Show all markers when filter is not active
            addMarkerToMap(marker);
        }
    });
}