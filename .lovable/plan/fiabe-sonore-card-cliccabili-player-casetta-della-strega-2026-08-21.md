# Fiabe sonore: card cliccabili + player "casetta della strega"

La pagina oggi è un elenco di titoli con i player grigi di default. La trasformiamo in una galleria di card illustrate, con un unico player fisso in basso (uguale su PC e cellulare) a forma di casetta della strega.

## Come funzionerà

1. **Ogni fiaba diventa una card cliccabile**
   - Griglia di card (3 colonne su PC, 2 su tablet, 1 su cellulare), raggruppate per raccolta.
   - Ogni card: piccolo disegno a tratto oro coerente col titolo della fiaba (es. corona, rana, luna, bosco, stella, gatto — scelto da parole chiave del titolo, con icona di riserva), titolo in serif corsivo, numero della traccia e durata.
   - Al passaggio del mouse la card si solleva leggermente e il disegno si anima; la card in ascolto resta evidenziata in oro con onde sonore animate.
   - Un clic avvia subito l'ascolto; un secondo clic mette in pausa.

2. **Player fisso in basso, a forma di casetta della strega**
   - Stessa posizione su PC e cellulare: barra ancorata al fondo dello schermo.
   - Sagoma disegnata in SVG: tetto spiovente storto con tegole, camino che emette un filo di fumo animato (si muove solo mentre la fiaba suona), due finestrelle illuminate che pulsano a ritmo, staccionata come barra di avanzamento.
   - Comandi: play/pausa grande e rotondo in oro, precedente / successivo, barra di avanzamento trascinabile con tempo trascorso e totale, volume, velocità (0.75x / 1x / 1.25x), passaggio automatico alla fiaba seguente.
   - Su cellulare i comandi si riducono a play/pausa, avanti/indietro e barra; volume e velocità restano solo su PC.
   - Il player compare solo dopo la prima selezione, con una piccola animazione di entrata.

3. **Decorazioni laterali a tema**
   - Ai lati della griglia (visibili da desktop in su) due colonne decorative disegnate a tratto oro su fondo bordeaux: a sinistra un bosco con alberi storti, funghi e una civetta; a destra torre della principessa, luna, stelle e pipistrelli.
   - Leggero movimento al passaggio (parallax discreto già in uso nel sito), fondali puramente decorativi (`aria-hidden`).

4. Restano invariati: hero animato attuale, link "Audiolibri per bambini", tracciamento GA4 all'avvio dell'ascolto, testi e query dei dati.

## Dettagli tecnici

- Nuovi componenti: `src/components/fiabe/FiabaCard.tsx`, `src/components/fiabe/WitchHousePlayer.tsx`, `src/components/fiabe/FiabeDecor.tsx` (SVG inline, nessuna dipendenza nuova, nessuna immagine da generare).
- Stato dell'ascolto in `src/routes/fiabe.tsx`: un solo elemento `<audio>` gestito con `useRef` (traccia corrente, playing, currentTime, duration, volume, rate); la lista piatta delle tracce ordinate permette avanti/indietro tra raccolte.
- Il player è `fixed bottom-0` con `padding-bottom` di compensazione sulla pagina e `env(safe-area-inset-bottom)` su iOS.
- Colori solo da token esistenti (`--brand-gold`, `surface-bordeaux`, `card`, `border`); animazioni con keyframes CSS aggiunti in `src/styles.css` (fumo, finestre, onde sonore).
- `trackAudioPlay(titolo, raccolta)` al primo play di ogni traccia.
- Accessibilità: card come `<button>` con `aria-pressed`, comandi con `aria-label`, focus visibile, decorazioni `aria-hidden`.
- `/audiolibri-per-bambini` resta invariata per ora.
