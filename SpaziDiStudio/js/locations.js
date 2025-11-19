import { getMap, createMarkerIcon, addMarkerToMap } from './map.js';
import { getColor } from './config.js';
import { showLocationInfo } from './ui.js';

// Store all markers
export const markers = [];
// Store locations data
export let locationsData = [];

// Load locations from file and initialize map
export async function loadLocations() {
    try {
        const response = await fetch('resources/SpaziDiStudio.json');
        if (!response.ok) {
            throw new Error('Failed to load resources/SpaziDiStudio.json');
        }
        const locations = await response.json();
        locationsData = locations;

        // Create markers for each location
        locations.forEach(location => {
            createLocationMarker(location);
        });
    } catch (error) {
        console.error('Error loading locations:', error);
        const { showCustomAlert } = await import('./ui.js');
        showCustomAlert('Errore nel caricamento dei dati. Assicurati che il file resources/SpaziDiStudio.json esista.', 'error');
    }
}

// Create marker for a single location
function createLocationMarker(location) {
    // Handle different field names and missing coordinates
    const latitudine = location.Latitudine || location.Latitudine || 41.1180;
    const longitudine = location.Longitudine || location.Longitudine || 16.8701;
    
    // Store normalized coordinates back to location object
    location.Latitudine = latitudine;
    location.Longitudine = longitudine;
    
    const color = getColor();
    const icon = createMarkerIcon(color);
    
    const marker = L.marker([latitudine, longitudine], { icon: icon })
        .bindTooltip(`<strong>${location.Spazio}</strong>`, {
            direction: 'top',
            offset: [0, -20]
        })
        .on('click', () => {
            showLocationInfo(location);
        });
    
    // Store location data with the marker for filtering
    marker.locationData = location;
    
    markers.push(marker);
    addMarkerToMap(marker);
}