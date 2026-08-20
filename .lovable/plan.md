# Etichette (categorie) per gli articoli

## Obiettivo

Poter assegnare un'etichetta a ogni articolo dall'editor e gestire l'elenco delle etichette (creare, rinominare, eliminare) dal pannello admin. Gli articoli vecchi hanno già l'etichetta: resta com'è. I nuovi si possono salvare senza etichetta e aggiungerla dopo.

## 1. Editor articolo

Nel form di `/admin/posts/...`, sotto lo Slug, un nuovo campo "Etichetta":

- Menu a tendina con tutte le etichette esistenti + voce "— Nessuna —".
- Accanto, un campo rapido "＋ Nuova etichetta": si scrive il nome, si preme Crea, viene creata e selezionata subito, senza uscire dall'articolo.
- Il valore viene salvato nel campo `category_id` dell'articolo (lo stesso già usato dalle notizie vecchie), quindi l'etichetta appare subito nella pagina Blog e nei filtri già presenti.

## 2. Nuova pagina admin "Etichette"

Voce di menu nuova nella barra laterale, tra Articoli e Libri:

- Elenco di tutte le etichette già esistenti nel sito, comprese quelle usate dagli articoli vecchi, con il numero di articoli associati a ciascuna.
- Se un articolo vecchio ha un'etichetta non più presente in elenco, viene recuperata e mostrata comunque, così nulla va perso.
- Crea: nome (lo slug si genera in automatico dal nome).
- Modifica: rinomina inline.
- Elimina: chiede conferma; se ci sono articoli associati, avvisa quanti sono e, confermando, li lascia semplicemente senza etichetta (non cancella nessun articolo).

## 3. Dettagli tecnici

- Tabella `categories` (id, name, slug, post_count) già esistente nel backend dei contenuti; nessuna modifica di schema.
- Nuovi/toccati: `src/routes/admin.etichette.tsx` (nuovo), `src/routes/admin.tsx` (voce di menu), `src/routes/admin.posts.$id.tsx` (campo etichetta + crea al volo), `src/routes/admin.posts.index.tsx` (colonna Etichetta nell'elenco).
- Le letture/scritture usano il client `db` già in uso nell'admin, autenticato come admin.
- Da verificare come primo passo: le regole di sicurezza della tabella `categories` in quel backend potrebbero consentire solo la lettura. Se la scrittura viene rifiutata, aggiungo le policy di inserimento/modifica/eliminazione riservate all'admin nella stessa iterazione.

## 4. Verifica

Creare un'etichetta, assegnarla a un articolo di prova, controllare che compaia nella pagina Blog e tra i filtri, poi rinominarla ed eliminarla verificando che l'articolo resti al suo posto senza etichetta.
