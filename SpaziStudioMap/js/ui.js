import { formatOrariApertura } from './utils.js';
import { validateForm } from './validation.js';

// Show location info in side panel
export function showLocationInfo(location) {
    const panel = document.getElementById('infoPanel');
    const nameEl = document.getElementById('locationName');
    const contentEl = document.getElementById('infoPanelContent');
    
    // Set header information
    nameEl.textContent = location.Spazio || 'Posto sconosciuto';
    
    // Build content with all available properties
    let content = '';
    
    // Display all properties except latitudine, longitudine, Name, and category (already shown)
    const excludeKeys = ['latitudine', 'longitudine', 'Name', 'category', 'Spazio', 'Categoria', 'Coordinates'];
    Object.keys(location).forEach(key => {
        if (!excludeKeys.includes(key)) {
            const value = location[key];
            if (value !== null && value !== undefined && value !== '') {
                let displayValue = value;
                
                // Special formatting for "orari apertura"
                if (key === 'orari apertura' && typeof value === 'object') {
                    displayValue = formatOrariApertura(value);
                } else if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
                    // Check if value is a URL
                    displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
                } else if (typeof value === 'object') {
                    // For other objects, stringify them
                    displayValue = JSON.stringify(value);
                }
                
                content += `
                    <div class="info-row">
                        <div class="info-label">${key}</div>
                        <div class="info-value">${displayValue}</div>
                    </div>
                `;
            }
        }
    });
    
    contentEl.innerHTML = content || '<p style="color: #999;">No additional information available.</p>';
    
    // Show the panel with slide animation
    panel.style.display = 'block';
    // Force reflow to ensure display change is applied before animation
    panel.offsetHeight;
    // Trigger slide animation
    requestAnimationFrame(() => {
        panel.classList.add('visible');
    });
}

// Close info panel
export function closeInfoPanel() {
    const panel = document.getElementById('infoPanel');
    panel.classList.remove('visible');
    
    // Hide panel after transition completes
    setTimeout(() => {
        if (!panel.classList.contains('visible')) {
            panel.style.display = 'none';
        }
    }, 300); // Match transition duration
}

// Custom alert function
export function showCustomAlert(message, type = 'success') {
    const overlay = document.getElementById('customAlertOverlay');
    const icon = document.getElementById('customAlertIcon');
    const messageEl = document.getElementById('customAlertMessage');
    
    // Set icon based on type
    if (type === 'success') {
        icon.textContent = '✓';
        icon.className = 'custom-alert-icon success';
    } else {
        icon.textContent = '✗';
        icon.className = 'custom-alert-icon error';
    }
    
    messageEl.textContent = message;
    overlay.classList.add('visible');
}

export function closeCustomAlert() {
    const overlay = document.getElementById('customAlertOverlay');
    overlay.classList.remove('visible');
}

// Form functions
export function openForm() {
    document.getElementById('formOverlay').classList.add('visible');
}

export function closeForm() {
    document.getElementById('formOverlay').classList.remove('visible');
    document.getElementById('addLocationForm').reset();
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

export async function submitForm(event) {
    event.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return false;
    }
    
    // Collect form data
    const spazio = document.getElementById('spazio').value.trim();
    const email = document.getElementById('email').value.trim();
    const descrizione = document.getElementById('descrizione').value.trim();
    const indirizzo = document.getElementById('indirizzo').value.trim();
    const funzionalita = document.getElementById('funzionalita').value.trim();
    const orari = document.getElementById('orari').value.trim();
    const indirizzoGoogle = document.getElementById('indirizzoGoogle').value.trim();
    const link = document.getElementById('link').value.trim();
    const capienza = document.getElementById('capienza').value;
    const note = document.getElementById('note').value.trim();
    
    // Get submit button for loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    
    try {
        // Read the form key from resources/config.json
        const configResponse = await fetch('resources/config.json');
        if (!configResponse.ok) {
            throw new Error('Failed to load configuration file');
        }
        const config = await configResponse.json();
        const formKey = config.formKey;
        
        if (!formKey) {
            throw new Error('Form key not found in configuration');
        }
        
        // Prepare data for Web3Forms
        const formData = {
            access_key: formKey,
            subject: `MAPPA: Nuova richiesta di spazio studio - ${spazio}`,
            from_name: "Nuovo spazio di studio proposto",
            email: email,
            spazio: spazio,
            descrizione_attivita: descrizione,
            indirizzo: indirizzo,
            funzionalita: funzionalita || 'N/A',
            orari_apertura: orari || 'N/A',
            indirizzo_google: indirizzoGoogle || 'N/A',
            link: link || 'N/A',
            capienza: capienza || 'N/A',
            note: note || 'N/A'
        };
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showCustomAlert('Richiesta inviata con successo! Grazie per il contributo.', 'success');
            // Restore button state before closing
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            closeForm();
        } else {
            throw new Error(result.message || 'Errore durante l\'invio');
        }
    } catch (error) {
        console.error('Error sending form:', error);
        showCustomAlert('Errore nell\'invio della richiesta. Riprova più tardi', 'error');
        
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
    
    return false;
}