# Mappe Interattive di Bari

Questa repository contiene tre progetti di mappe interattive per la città di Bari, insieme a strumenti per l'elaborazione dei dati.

## 🚀 Come Utilizzare

1. Clonare la repository `git clone https://github.com/AlessandroCarella/scomodo-mappe-interattive.git`
2. Aprire il file `index.html` della mappa desiderata in un browser
3. Per SpaziStudioMap, assicurarsi di aver configurato il file `config.json`

## 📊 Dati Comuni

Tutti i progetti condividono alcuni file di risorse:
- `bariCoordinates.json` - Coordinate geografiche di Bari
- `SpaziDiConsumo.json` - Database degli spazi di consumo (presente in SpaziDiAggregazione e SpaziDiLotta)
- `scomodissima_icona.ico` - Icona del progetto



## 📁 Struttura del Progetto

### 🗺️ SpaziDiStudio

Mappa interattiva degli **spazi di studio** disponibili a Bari.

**Funzionalità principali:**
- Filtro temporale interattivo: selezione giorno + slider orario
- Pulsante "Mostra solo aperti" per filtrare i luoghi aperti in un dato momento
- Form per proporre nuovi spazi di studio
- Visualizzazione orari di apertura formattati per ogni giorno
- Pannello informativo con tutti i dettagli del luogo
- Invio proposte via Web3Forms API

**File dati:** `SpaziDiStudio.json`

### ⚠️ Nota Importante - Configurazione SpaziDiStudio

Per far funzionare correttamente il **form di segnalazione** all'interno della pagina SpaziDiStudio, è necessario creare un file di configurazione:

1. Nella cartella `SpaziDiStudio/resources/` creare il file `config.json`

2. Inserire il seguente contenuto:

```json
{
  "formKey": "YOUR_WEB3FORMS_ACCESS_KEY"
}
```

3. **Come ottenere la chiave:**
   - Registrarsi su [Web3Forms](https://web3forms.com/)
   - Creare un nuovo form e ottenere l'Access Key
   - Copiare l'Access Key e inserirla nel file `config.json`
   - Vedi guida più dettagliata [qui](https://www.emailjs.com/docs/tutorial/overview/)

> **Attenzione:** La chiave `formKey` è associata all'account Web3Forms e all'indirizzo email configurato per ricevere le notifiche del form.

---

### 🗺️ SpaziDiAggregazione

Mappa interattiva degli **spazi di aggregazione** a Bari.

**Funzionalità principali:**
- Due sorgenti dati configurabili: Spazi di Aggregazione, Spazi di consumo
- Doppia modalità di visualizzazione: Pin e Heatmap per ogni sorgente
- Pannello di controllo per attivare/disattivare le visualizzazioni
- Pannello informativo laterale con dettagli sui luoghi

**File dati:** `SpaziDiAggregazione.json`, `SpaziDiConsumo.json`

---

### 🗺️ SpaziDiLotta

Mappa interattiva degli **spazi di lotta** di Bari.

**Funzionalità principali:**
- Sistema Spotlight: evidenzia singoli luoghi con overlay scuro circostante
- Modalità Multi-Spotlight: pulsante "Tutti gli Spazi" per visualizzare tutti i luoghi contemporaneamente
- Filtro automatico degli spazi di consumo in base alla distanza dal punto spotlight (raggio 150m)
- Pannello informativo con dettagli sui luoghi

**File dati:** `SpaziDiLotta.json`, `SpaziDiConsumo.json`

---

## 📓 Notebook

### mappaturaExcelToJson.ipynb

Notebook per la **conversione dei dati** dal file Excel della redazione in formato JSON utilizzabile dalle mappe. Trasforma i dati grezzi nel formato strutturato richiesto dai vari progetti.

### query.ipynb

Notebook per **interrogare le API di OpenStreetMap** e ottenere dati geografici aggiuntivi come:
- Coordinate dei luoghi
- Spazi di consumo circostanti (bar, ristoranti, fermate bus, ecc.)
- Confini geografici di Bari

---

## 🛠️ Tecnologie Utilizzate

- **Leaflet.js** - Libreria per mappe interattive
- **JavaScript vanilla** - Logica applicativa
- **CSS modulare** - Stili separati per componenti
- **Python/Jupyter** - Elaborazione dati
- **OpenStreetMap API** - Dati geografici
