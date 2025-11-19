// Centralized text strings for the application
export const text = {
    ui: {
        unknownLocation: 'Posto sconosciuto',
        uncategorized: 'Non categorizzato',
        noAdditionalInfo: 'Nessuna informazione aggiuntiva disponibile.',
        coordinates: 'Coordinate',
        sending: 'Invio in corso...',
        successMessage: 'Richiesta inviata con successo! Grazie per il contributo.',
        errorMessage: 'Errore nell\'invio della richiesta. Riprova più tardi',
        configLoadError: 'Errore nel caricamento del file di configurazione',
        formKeyError: 'Chiave form non trovata nel file config.json',
        submitError: 'Errore durante l\'invio',
        formSubject: 'MAPPA: Nuova richiesta di spazio',
        formFromName: 'Mappa Spazi',
        notApplicable: 'N/A'
    },
    utils: {
        days: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
        daysOrdered: ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'],
        closed: 'Chiuso'
    },
    validation: {
        required: 'Questo campo è obbligatorio',
        invalidEmail: 'Inserisci un indirizzo email valido',
        descriptionTooShort: 'La descrizione deve essere di almeno 10 caratteri',
        invalidUrl: 'Inserisci un URL valido',
        invalidNumber: 'Inserisci un numero valido maggiore o uguale a 0'
    },
    filters: {
        showOnlyOpen: 'mostra solo aperti'
    },
    locations: {
        loadError: 'Errore nel caricamento dei dati. Assicurati che il file resources/SpaziDiStudio.json esista.',
        fetchError: 'Errore nel caricamento del file resources/SpaziDiStudio.json'
    }
};