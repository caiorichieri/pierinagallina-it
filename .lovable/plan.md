# Player "casetta della strega" con l'illustrazione caricata

Sostituiamo il player disegnato in SVG con l'immagine che hai caricato: diventa lo sfondo della barra fissa in basso, con i comandi veri posizionati sopra i dettagli del disegno.

## Come funzionerà

1. **Desktop (da ~1024px in su)**
   - La barra fissa in basso mostra l'illustrazione intera (tetto, camino con fumo, calderone, pergamene, boccette).
   - Sopra il disegno, elementi cliccabili invisibili allineati alla grafica:
     - titolo della fiaba e nome della raccolta nel punto in cui l'immagine li mostra (testo reale, non parte dell'immagine);
     - barra di avanzamento trascinabile sul tratto a sinistra, con tempo trascorso e durata ai due estremi;
     - pergamene precedente / play-pausa / successivo come pulsanti;
     - icona altoparlante che apre il cursore del volume;
     - boccette 0.75x / 1x / 1.25x come selettore di velocità, con la boccetta attiva evidenziata.
   - Il pulsante centrale grande (play sopra il calderone) resta il comando principale; in riproduzione mostra la pausa e il fumo si anima.

2. **Mobile**
   - L'illustrazione è troppo panoramica per lo schermo stretto: si mostra solo la parte centrale (ritaglio), con sopra play/pausa, avanti/indietro, titolo e barra di avanzamento.
   - Volume e velocità restano solo su desktop, come oggi.

3. **Resto invariato**
   - Card delle fiabe, decori laterali, hero, tracciamento GA4, logica audio e passaggio automatico alla traccia successiva non cambiano.

## Dettagli tecnici

- L'immagine viene caricata su CDN con `lovable-assets` e referenziata via pointer `.asset.json` (nessun binario nel repo).
- `WitchHousePlayer.tsx` riscritto: contenitore con `aspect-ratio` fisso dell'immagine e `background-image`; i controlli sono posizionati in percentuale (`absolute` con `left/top` in %) così restano allineati a qualsiasi larghezza.
- Sotto una certa larghezza si passa a un layout compatto con `background-position` centrata e controlli in flex, senza posizionamento percentuale.
- Nessun cambiamento a `src/routes/fiabe.tsx` se non i props già esistenti; accessibilità mantenuta (`aria-label` su ogni comando, focus visibile).
- Le animazioni CSS attuali (fumo, finestre) vengono sostituite da un leggero effetto sul fumo già disegnato nell'immagine (opacità/scala pulsante) durante la riproduzione.
