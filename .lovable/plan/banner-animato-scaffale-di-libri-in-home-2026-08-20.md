# Banner animato "Scaffale di libri" in Home

Nuova striscia a tutta larghezza subito sotto l'hero della Home, con le copertine dei libri che scorrono in loop e la foto di Pierina come chiusura fissa a destra.

## Come funziona

- Fascia orizzontale su fondo coerente con la Home (carta avorio + velo dorato/bordô), separata da un bordo sottile sopra e sotto.
- Le copertine scorrono lentamente da destra a sinistra in loop continuo, senza stacchi (sequenza duplicata).
- Il libro sotto il cursore si solleva, si ingrandisce leggermente e guadagna ombra; lo scorrimento rallenta/si ferma al passaggio del mouse.
- I libri sono cliccabili e portano alla pagina Libri.
- A destra, ancorata e ferma, la foto di Pierina con la scritta www.pierinagallina.it, sfumata verso il fondo come nell'hero. Su mobile la foto si nasconde e resta solo lo scaffale scorrevole (più basso).
- Sfumature laterali (fade) ai bordi così i libri entrano ed escono in modo morbido.
- Rispetto di `prefers-reduced-motion`: niente scorrimento automatico, la fila diventa scorribile a dito/trackpad.

## Contenuti usati

- Le 10 copertine trasparenti già presenti in `src/assets/libri/` (stesse immagini della pagina Libri), escluse quelle nascoste.
- La foto di Pierina ritagliata dal banner caricato, pubblicata come asset CDN.

## Dettagli tecnici

- Nuovo componente `src/components/BookShelfBanner.tsx`, inserito in `src/routes/index.tsx` tra la sezione hero e la sezione "Tre sentieri di parole".
- Marquee in CSS puro: keyframe `book-marquee` in `src/styles.css` con `translate3d(0 → -50%)`, durata ~40s lineare, `animation-play-state: paused` su hover del contenitore.
- Copertine importate dai PNG esistenti e filtrate con `isBookHidden` da `src/content/libri.ts`, così il banner resta allineato al catalogo.
- Foto Pierina: ritaglio dal file caricato, upload via `lovable-assets`, riferimento tramite pointer `.asset.json`.
- Immagini con `loading="lazy"`, `alt` col titolo del libro; nessuna modifica al database o alla logica esistente.
