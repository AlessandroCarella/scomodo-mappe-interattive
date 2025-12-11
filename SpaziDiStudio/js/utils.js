// Helper function to convert time string to decimal hours
function timeToDecimal(time) {
    // If already a number, return it
    if (typeof time === "number") {
        return time;
    }

    // If it's a string, parse it
    if (typeof time === "string") {
        // Handle formats like "7:30", "8:00", "08:30"
        if (time.includes(":")) {
            const [hours, minutes] = time
                .split(":")
                .map((part) => parseInt(part, 10));
            return hours + minutes / 60;
        }
        // Handle plain number strings like "8", "19"
        return parseFloat(time);
    }

    return 0;
}

// Helper function to format decimal hours to HH:MM string
function decimalToTime(decimal) {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal % 1) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
    )}`;
}

// Function to check if a location is currently open
export function isLocationOpen(location, customDay = null, customHour = null) {
    if (!location["orari apertura"]) {
        return true; // If no hours specified, consider it always open
    }

    // Use custom day/hour if provided, otherwise use current time
    const now = new Date();
    const currentDay =
        customDay ||
        [
            "domenica",
            "lunedì",
            "martedì",
            "mercoledì",
            "giovedì",
            "venerdì",
            "sabato",
        ][now.getDay()];
    const currentHour =
        customHour !== null
            ? customHour
            : now.getHours() + now.getMinutes() / 60;

    const daySchedule = location["orari apertura"][currentDay];

    // If no schedule for this day or empty arrays, it's closed
    if (
        !daySchedule ||
        !daySchedule.apertura ||
        daySchedule.apertura.length === 0
    ) {
        return false;
    }

    // Check each time slot - a location can have multiple opening periods per day
    // e.g., 8:00-13:30 and then 14:30-17:30
    for (let i = 0; i < daySchedule.apertura.length; i++) {
        const openTime = timeToDecimal(daySchedule.apertura[i]);
        const closeTime = timeToDecimal(daySchedule.chiusura[i]);

        // Check if current time falls within this slot
        if (currentHour >= openTime && currentHour < closeTime) {
            return true;
        }
    }

    return false; // Not within any opening hours
}

// Format opening hours for display
export function formatOrariApertura(orari) {
    const giorni = [
        "lunedì",
        "martedì",
        "mercoledì",
        "giovedì",
        "venerdì",
        "sabato",
        "domenica",
    ];
    let html = '<div class="orari-schedule">';

    giorni.forEach((giorno) => {
        const daySchedule = orari[giorno];

        if (!daySchedule) {
            return; // Skip if no data for this day
        }

        html += `<div class="orari-day">`;
        html += `<span class="day-name">${
            giorno.charAt(0).toUpperCase() + giorno.slice(1)
        }:</span> `;

        // Check if the location is closed (empty or no apertura array)
        if (!daySchedule.apertura || daySchedule.apertura.length === 0) {
            html += `<span class="closed">Chiuso</span>`;
        } else {
            // Handle multiple time slots per day
            const slots = [];

            for (let i = 0; i < daySchedule.apertura.length; i++) {
                const openTime = timeToDecimal(daySchedule.apertura[i]);
                const closeTime = timeToDecimal(daySchedule.chiusura[i]);

                const openStr = decimalToTime(openTime);
                const closeStr = decimalToTime(closeTime);

                slots.push(`${openStr} - ${closeStr}`);
            }

            // Join multiple slots with comma and space
            html += `<span class="time-slots">${slots.join(", ")}</span>`;
        }

        html += `</div>`;
    });

    html += "</div>";
    return html;
}
