# Richieste della cliente — cosa faccio

## 1. Chi sono: riquadro "30 anni di viaggi"
Nella fila dei numeri (42 scuola · 40+ giornalismo · 9 libri · 7 volte nonna) aggiungo un quinto
riquadro **30 · anni di viaggi**, con la griglia riadattata così restano allineati su computer e telefono.

## 2. Home, fascia rossa: i viaggi
Nel testo di presentazione sotto "Giornalista, scrittrice, poetessa" aggiungo i viaggi:
"Di Codroipo, in Friuli. Raccolgo storie ed emozioni in giro per il mondo: a volte diventano poesie,
altre fiabe, racconti o articoli di giornale." Aggiorno anche la descrizione per Google nello stesso senso.

## 3. Fotografie: "Istanti che restano appesi" + eventi
Nel testo sotto il titolo aggiungo gli eventi: "Eventi, presentazioni, letture nelle scuole, radio,
amici, viaggi e paesaggi del Friuli."

## 4. Etichette: si vedono anche nel post pubblico
Oggi le etichette compaiono solo nell'elenco Blog e nell'editor. Le faccio comparire anche
**sotto il titolo di ogni articolo**, tutte (non solo la prima), come piccole pastiglie cliccabili
che riportano al Blog filtrato su quell'etichetta.

## 5. Foto nei post: piccola / media / grande sempre disponibile
Le tre scelte oggi appaiono solo quando l'editor "riconosce" la foto selezionata, e con un clic
distratto spariscono. Le rendo stabili: la barra Foto resta visibile e agisce sull'ultima foto
toccata; in più aggiungo la scelta anche dal clic diretto sulla foto (menù galleggiante sopra
l'immagine) con le stesse tre misure.

## 6. Video YouTube dentro l'articolo
Nuovo pulsante nell'editor: si incolla il link del video (o il link breve youtu.be) e nel punto del
testo compare il player, guardabile direttamente dall'articolo, su computer e telefono.
Nessun cambio alla copertina.

## 7. Commenti sotto i post, con approvazione
- In fondo a ogni articolo: modulo con nome, email (non pubblicata, facoltativa) e messaggio.
- Il commento **non** compare subito: resta in attesa finché Pierina non lo approva.
- Nuova voce **Commenti** nel pannello admin: elenco in attesa / approvati, con Approva ed Elimina.
- Notifica via email a Pierina quando arriva un nuovo commento (stesso sistema dei messaggi dal sito).
- Anti-spam senza scomodare i lettori: campo trappola invisibile, limite di frequenza per indirizzo IP,
  link/HTML rimossi dal testo del commento.

## Dettagli tecnici
- Testi: `src/routes/chi-sono.tsx`, `src/routes/index.tsx`, `src/components/FotografieHero.tsx`.
- Etichette nel post: `src/routes/blog.$slug.tsx` legge `category_id` + i tag extra da `postTagIds`,
  carica i nomi da `categories` e collega a `/scritti?cat=...`.
- Editor: `src/components/RichTextEditor.tsx` — stato "ultima immagine selezionata" per la barra
  misure, bubble menu sull'immagine, nodo YouTube (iframe responsivo) e relativa apertura in
  `src/lib/sanitize.ts` per gli iframe di youtube-nocookie.
- Commenti: nuova tabella `post_comments` (id, post_id, author_name, author_email, body, approved,
  created_at) nel backend contenuti, con GRANT e RLS: lettura pubblica solo delle righe approvate,
  inserimento consentito ma sempre non approvato, gestione riservata all'admin.
  Nuovi file: `src/components/PostComments.tsx`, `src/routes/admin.commenti.tsx`, voce nel menu di
  `src/routes/admin.tsx`; notifica email tramite la funzione già usata per i messaggi.

## Verifica
Post di prova con due etichette, tre foto in misure diverse e un video: controllo su computer e
telefono, invio un commento da visitatore e verifico che compaia solo dopo l'approvazione.
