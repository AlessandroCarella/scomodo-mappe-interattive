// Helper function to convert time string to decimal hours
function timeToDecimal(time) {
    // If already a number, return it
    if (typeof time === 'number') {
        return time;
    }
    
    // If it's a string, parse it
    if (typeof time === 'string') {
        // Handle formats like "7:30", "8:00", "08:30"
        if (time.includes(':')) {
            const [hours, minutes] = time.split(':').map(part => parseInt(part, 10));
            return hours + (minutes / 60);
        }
        // Handle plain number strings like "8", "19"
        return parseFloat(time);
    }
    
    return 0;
}

// Function to check if a location is currently open
export function isLocationOpen(location, customDay = null, customHour = null) {
    if (!location['orari apertura']) {
        return true; // If no hours specified, consider it always open
    }
    
    // Use custom day/hour if provided, otherwise use current time
    const now = new Date();
    const currentDay = customDay || ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'][now.getDay()];
    const currentHour = customHour !== null ? customHour : (now.getHours() + now.getMinutes() / 60);
    
    const daySchedule = location['orari apertura'][currentDay];
    
    if (!daySchedule || !daySchedule.apertura || daySchedule.apertura.length === 0) {
        return false; // Closed if no opening hours
    }
    
    // Check each time slot
    for (let i = 0; i < daySchedule.apertura.length; i++) {
        const openTime = timeToDecimal(daySchedule.apertura[i]);
        const closeTime = timeToDecimal(daySchedule.chiusura[i]);
        
        if (currentHour >= openTime && currentHour < closeTime) {
            return true;
        }
    }
    
    return false;
}

// Format opening hours for display
export function formatOrariApertura(orari) {
    const giorni = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
    let html = '<div class="orari-schedule">';
    
    giorni.forEach(giorno => {
        if (orari[giorno]) {
            const daySchedule = orari[giorno];
            html += `<div class="orari-day">`;
            html += `<span class="day-name">${giorno.charAt(0).toUpperCase() + giorno.slice(1)}:</span> `;
            
            if (!daySchedule.apertura || daySchedule.apertura.length === 0) {
                html += `<span class="closed">Chiuso</span>`;
            } else {
                const slots = [];
                for (let i = 0; i < daySchedule.apertura.length; i++) {
                    const open = timeToDecimal(daySchedule.apertura[i]);
                    const close = timeToDecimal(daySchedule.chiusura[i]);
                    
                    // Format hours (handle 24 as special case for midnight)
                    const openStr = open === 0 ? '00:00' : (Number.isInteger(open) ? `${open}:00` : `${Math.floor(open)}:${String(Math.round((open % 1) * 60)).padStart(2, '0')}`);
                    const closeStr = close === 24 ? '24:00' : (Number.isInteger(close) ? `${close}:00` : `${Math.floor(close)}:${String(Math.round((close % 1) * 60)).padStart(2, '0')}`);
                    
                    slots.push(`${openStr} - ${closeStr}`);
                }
                html += `<span class="time-slots">${slots.join(', ')}</span>`;
            }
            
            html += `</div>`;
        }
    });
    
    html += '</div>';
    return html;
}