import { initializeMap } from './js/map.js';
import { loadLocations } from './js/locations.js';
import { 
    openForm, 
    closeForm, 
    closeInfoPanel, 
    closeCustomAlert,
    submitForm 
} from './js/ui.js';
import { setupFormValidation } from './js/validation.js';
import { updateTimeFilter } from './js/filters.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize map
    initializeMap();
    
    // Load locations (regular markers)
    await loadLocations();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup form validation
    setupFormValidation();
    
    // Initialize time filter with current day and time
    initializeTimeFilter();
});

function setupEventListeners() {
    // Add location button
    document.getElementById('addLocationBtn').addEventListener('click', openForm);
    
    // Form close button
    document.getElementById('formCloseBtn').addEventListener('click', closeForm);
    
    // Form overlay click (close when clicking outside)
    document.getElementById('formOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'formOverlay') {
            closeForm();
        }
    });
    
    // Form submit
    document.getElementById('addLocationForm').addEventListener('submit', submitForm);
    
    // Close info panel button
    document.getElementById('closePanelBtn').addEventListener('click', closeInfoPanel);
    
    // Custom alert button
    document.getElementById('customAlertBtn').addEventListener('click', closeCustomAlert);
    
    // Custom alert overlay click (close when clicking outside)
    document.getElementById('customAlertOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'customAlertOverlay') {
            closeCustomAlert();
        }
    });
    
    // Time filter controls
    const daySelect = document.getElementById('daySelect');
    const hourSlider = document.getElementById('hourSlider');
    const showOpenBtn = document.getElementById('showOpenBtn');
    
    daySelect.addEventListener('change', handleTimeFilterChange);
    hourSlider.addEventListener('input', handleHourSliderChange);
    showOpenBtn.addEventListener('click', handleShowOpenToggle);    
}

function initializeTimeFilter() {
    const now = new Date();
    const days = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    const currentDay = days[now.getDay()];
    const currentHour = now.getHours() + now.getMinutes() / 60;
    
    // Set dropdown to current day
    document.getElementById('daySelect').value = currentDay;
    
    // Set slider to current hour
    document.getElementById('hourSlider').value = currentHour;
    updateHourDisplay(currentHour);
    
    // Set "mostra solo aperti" button to active by default
    document.getElementById('showOpenBtn').classList.add('active');
    
    // Apply initial filter with "show only open" enabled
    updateTimeFilter(currentDay, currentHour, true);
}

function handleHourSliderChange(event) {
    const hour = parseFloat(event.target.value);
    updateHourDisplay(hour);
    handleTimeFilterChange();
}

function updateHourDisplay(hour) {
    const hours = Math.floor(hour);
    const minutes = Math.round((hour % 1) * 60);
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    document.getElementById('hourValue').textContent = timeString;
}

function handleShowOpenToggle(event) {
    const button = event.target;
    button.classList.toggle('active');
    toggleTimeControls(button.classList.contains('active'));
    handleTimeFilterChange();
}

function toggleTimeControls(enabled) {
    const daySelect = document.getElementById('daySelect');
    const hourSlider = document.getElementById('hourSlider');
    
    daySelect.disabled = !enabled;
    hourSlider.disabled = !enabled;
}

function handleTimeFilterChange() {
    const day = document.getElementById('daySelect').value;
    const hour = parseFloat(document.getElementById('hourSlider').value);
    const showOpen = document.getElementById('showOpenBtn').classList.contains('active');
    
    updateTimeFilter(day, hour, showOpen);
}