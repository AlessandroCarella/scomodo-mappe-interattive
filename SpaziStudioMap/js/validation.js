function validateUrl(url) {
    if (!url) return true; // Empty URLs are valid (optional fields)
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Real-time field validation
export function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const errorEl = document.getElementById(`error-${fieldId}`);
    let isValid = true;
    
    // Clear previous error state
    field.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
    
    switch(fieldId) {
        case 'spazio':
            if (!value) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Questo campo è obbligatorio';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Questo campo è obbligatorio';
                    errorEl.classList.add('visible');
                }
            } else if (!emailRegex.test(value)) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Inserisci un indirizzo email valido';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'descrizione':
            if (!value) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Questo campo è obbligatorio';
                    errorEl.classList.add('visible');
                }
            } else if (value.length < 10) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'La descrizione deve essere di almeno 10 caratteri';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'indirizzo':
            if (!value) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Questo campo è obbligatorio';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'indirizzoGoogle':
            if (value && !validateUrl(value)) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Inserisci un URL valido';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'link':
            if (value && !validateUrl(value)) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Inserisci un URL valido';
                    errorEl.classList.add('visible');
                }
            }
            break;
            
        case 'capienza':
            if (value && (isNaN(value) || parseInt(value) < 0)) {
                isValid = false;
                if (errorEl) {
                    errorEl.textContent = 'Inserisci un numero valido maggiore o uguale a 0';
                    errorEl.classList.add('visible');
                }
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('error');
    }
    
    return isValid;
}

// Validate entire form
export function validateForm() {
    const fieldsToValidate = [
        'spazio', 'email', 'descrizione', 
        'indirizzo', 'indirizzoGoogle', 'link', 'capienza'
    ];
    
    let isValid = true;
    
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Setup form validation event listeners
export function setupFormValidation() {
    const fieldsToValidate = [
        'spazio', 'email', 'descrizione', 
        'indirizzo', 'indirizzoGoogle', 'link', 'capienza'
    ];
    
    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Validate on blur (when user leaves the field)
            field.addEventListener('blur', () => {
                if (field.value.trim() || field.required) {
                    validateField(field);
                }
            });
            
            // Clear error on input (but don't validate until blur)
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    field.classList.remove('error');
                    const errorEl = document.getElementById(`error-${fieldId}`);
                    if (errorEl) {
                        errorEl.classList.remove('visible');
                    }
                }
            });
        }
    });
}