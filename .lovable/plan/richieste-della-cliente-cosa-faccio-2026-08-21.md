# Richieste della cliente — cosa faccio

## 1. Quattro sentieri di parole
Home: il blocco "Il mio mondo" diventa "Quattro sentieri di parole" con quattro riquadri:
Blog · I miei libri · Poesie e racconti (nuovo riquadro) · Fiabe sonore.
Il nuovo riquadro "Poesie e racconti" porta alla pagina Blog filtrata sull'etichetta poesie/racconti
(oppure a una sezione dedicata, se preferisce una pagina propria — mi confermi).

## 2. I miei libri sulla stessa riga
Lo scaffale in home viene compattato: su schermo grande tutte le copertine stanno su un'unica riga
(copertine più piccole, senza scorrimento). Su tablet/telefono restano due righe o lo scorrimento
laterale, altrimenti diventano illeggibili. In più metto "Vita da emotiva" come primo titolo, così
si vede subito.

## 3. Blog: "Ultimi post"
Cambio il titolo della sezione in home da "Ultimi racconti" a "Ultimi post".

## 4. Etichette: due sullo stesso post
Oggi ogni post ha una sola etichetta, per questo mettendone una nuova sostituisce la precedente.
Passo a etichette multiple: nell'editor si spuntano/aggiungono più etichette e nel Blog il post
compare sotto ognuna di esse. Le etichette già assegnate restano.

## 5. Foto dentro il post: affiancate
Nell'editor aggiungo il pulsante "Affianca foto": le foto selezionate si mettono in fila
(2 o 3 per riga) invece che una sotto l'altra, così la pagina resta corta e si scorre meno.
Restano i formati piccola / media / grande (rinomino "piena" in "grande") e li applico anche
alle foto affiancate. Su telefono le foto affiancate si dispongono automaticamente su una o due
colonne.

## 6. Foto di copertina intera
Oggi la copertina del post viene ritagliata a fascia. Aggiungo nell'editor l'opzione
"Mostra copertina intera": se attiva, la foto si vede completa (senza tagli) sopra il titolo,
per tutti i visitatori. Chi non tocca nulla mantiene l'aspetto attuale.
Inoltre, cliccando sulla copertina si aprirà comunque l'immagine intera a schermo.

## Dettagli tecnici
- Home: `src/routes/index.tsx` (quarto riquadro, titolo "Quattro sentieri", "Ultimi post"),
  `src/components/BookShelfBanner.tsx` (riga unica su desktop, ordine copertine).
- Etichette multiple: nuova tabella di collegamento `post_tags (post_id, category_id)` nel backend
  contenuti, con GRANT + RLS (lettura pubblica, scrittura solo admin); migrazione dei valori
  esistenti da `posts.category_id`; `category_id` resta per compatibilità con il primo tag.
  Toccati: `src/routes/admin.posts.$id.tsx`, `admin.posts.index.tsx`, `admin.etichette.tsx`,
  `src/routes/scritti.tsx`.
- Editor: `src/components/RichTextEditor.tsx` — inserimento in griglia (nodo/figure con classe
  `img-row`), etichette formati piccola/media/grande; stili in `src/styles.css` e nel contenitore
  `prose` del post.
- Copertina: campo `cover_full` (boolean) sui post + resa in `src/routes/blog.$slug.tsx`
  (`object-contain` con altezza automatica) e lightbox al clic.

## Verifica
Post di prova con due etichette, tre foto affiancate in formati diversi e copertina intera:
controllo su computer e telefono, e che il post compaia sotto entrambe le etichette nel Blog.
