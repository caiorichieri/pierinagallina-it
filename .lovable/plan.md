# Fiabe sonore: nuovo player illustrato

La pagina oggi mostra solo elenchi di titoli con il player HTML grigio di default, uno per riga. La rifacciamo attorno a un unico player centrale, in tono con la grafica delle fiabe (bordeaux + oro, tratto disegnato).

## Come funzionerà

1. **Selettore raccolta**: in alto, i titoli delle raccolte come "capitoli" cliccabili (stile serif corsivo con sottolineatura oro).
2. **Lista fiabe a sinistra**: le tracce della raccolta scelta, ognuna con numero, titolo serif e durata; quella in ascolto si evidenzia in oro con un piccolo indicatore di onde animate.
3. **Player a destra (sopra su mobile)**: pannello bordeaux con
   - titolo della fiaba e raccolta,
   - pulsante play/pausa grande e rotondo in oro,
   - precedente / successivo,
   - barra di avanzamento trascinabile con tempo trascorso e totale,
   - controllo volume e velocità (0.75x / 1x / 1.25x),
   - passaggio automatico alla fiaba seguente a fine traccia.
4. **Sticky su mobile**: quando si scorre la lista, una barra compatta del player resta in basso, così si può cambiare fiaba senza perdere i comandi.
5. L'hero animato attuale resta invariato, così come il link agli audiolibri e il tracciamento GA4 al play.

## Dettagli tecnici

- Nuovo componente `src/components/FiabePlayer.tsx`: un solo `<audio>` nascosto gestito con `useRef` + stato React (traccia corrente, playing, currentTime, duration, volume, rate); nessuna dipendenza nuova.
- `src/routes/fiabe.tsx` mantiene la stessa query (`fiabe_collections` + `fiabe_tracks`) e passa i dati al player al posto dell'attuale lista con `<audio controls>`.
- Colori solo da token esistenti (`--brand-gold`, `surface-bordeaux`, `card`, `border`); animazioni con le utility già presenti (`animate-fade-in`, `Reveal`).
- `trackAudioPlay(titolo, raccolta)` invocato al play della traccia.
- Accessibilità: pulsanti con `aria-label`, lista come `<ul>` di `<button>`, focus visibile.
- La pagina `/audiolibri-per-bambini` resta com'è (riuso opzionale dello stesso player in un secondo momento, se lo vuoi).
