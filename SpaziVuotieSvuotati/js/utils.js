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
        if (orari[giorno]) {
            const daySchedule = orari[giorno];
            html += `<div class="orari-day">`;
            html += `<span class="day-name">${
                giorno.charAt(0).toUpperCase() + giorno.slice(1)
            }:</span> `;

            if (!daySchedule.apertura || daySchedule.apertura.length === 0) {
                html += `<span class="closed">Chiuso</span>`;
            } else {
                const slots = [];
                for (let i = 0; i < daySchedule.apertura.length; i++) {
                    const open = daySchedule.apertura[i];
                    const close = daySchedule.chiusura[i];

                    // Format hours (handle 24 as special case for midnight)
                    const openStr =
                        open === 0
                            ? "00:00"
                            : Number.isInteger(open)
                            ? `${open}:00`
                            : `${Math.floor(open)}:${String(
                                  Math.round((open % 1) * 60)
                              ).padStart(2, "0")}`;
                    const closeStr =
                        close === 24
                            ? "24:00"
                            : Number.isInteger(close)
                            ? `${close}:00`
                            : `${Math.floor(close)}:${String(
                                  Math.round((close % 1) * 60)
                              ).padStart(2, "0")}`;

                    slots.push(`${openStr} - ${closeStr}`);
                }
                html += `<span class="time-slots">${slots.join(", ")}</span>`;
            }

            html += `</div>`;
        }
    });

    html += "</div>";
    return html;
}

// Calculate the centroid (center) of a polygon given an array of [lat, lng] coordinates
export function calculatePolygonCenter(coordinates) {
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    let sumLat = 0;
    let sumLng = 0;

    coordinates.forEach((coord) => {
        sumLat += coord[0];
        sumLng += coord[1];
    });

    return {
        lat: sumLat / coordinates.length,
        lng: sumLng / coordinates.length,
    };
}
