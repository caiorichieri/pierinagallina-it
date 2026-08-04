# Newsletter, statistiche di visita e pannello SEO

## 1. Newsletter: cancellazione iscritti

Oggi il pulsante cestino chiama una `delete` e poi ricarica la lista, ma se il database rifiuta silenziosamente l'operazione l'utente non vede alcun errore e la riga resta lì.

Da verificare come primo passo (non ancora confermato): il database dei contenuti è quello del progetto originale, e con la chiave pubblica la tabella `newsletter_subscribers` non restituisce righe — segno che le regole di accesso sono attive. La causa più probabile è che manchi il permesso di cancellazione per l'utente amministratore, ma va confermata con una prova reale da admin autenticata.

Interventi:
- Eseguire una cancellazione di prova da sessione admin e leggere la risposta reale del database (numero di righe cancellate + eventuale errore).
- Se il problema è nel codice: correggere la chiamata (richiedere il ritorno della riga cancellata, mostrare un messaggio d'errore visibile, aggiornare la lista solo a operazione riuscita, feedback "Iscritto rimosso").
- Se il problema è nei permessi del database del progetto originale: quel database non è modificabile da questo progetto. In quel caso lo segnalo chiaramente e propongo l'alternativa (regola di cancellazione da aggiungere nel progetto originale) invece di fingere che sia risolto.
- In ogni caso: sostituire il `confirm()` del browser con una conferma coerente con lo stile del sito e aggiungere selezione multipla + "Rimuovi selezionati".

## 2. Statistiche di visita nel dashboard

Nel database originale esistono le tabelle `post_views` e `site_visits`, ma con la chiave pubblica risultano vuote e il sito attuale **non registra nessuna visita** (nessun codice di tracciamento nel progetto). Quindi oggi non ci sono dati da mostrare.

Soluzione proposta: creare il tracciamento nel backend di **questo** progetto (che possiamo modificare), così le statistiche partono da subito e sono indipendenti dal sito vecchio.

- Nuova tabella visite: percorso della pagina, eventuale id/slug articolo, data/ora, referrer, tipo dispositivo, identificativo di sessione anonimo (nessun dato personale, cookie-free).
- Registrazione della visita a ogni cambio pagina, esclusa tutta l'area `/admin`.
- Nel dashboard admin, nuova sezione "Visite":
  - visite e visitatori unici di oggi, ultimi 7 giorni, ultimi 30 giorni;
  - grafico giornaliero degli ultimi 30 giorni;
  - pagine più viste;
  - provenienza dei visitatori (referrer) e ripartizione mobile/desktop.
- Nella pagina "Articoli", una colonna "Visite" per ogni articolo, con classifica degli articoli più letti (7 e 30 giorni).

## 3. Nuova scheda SEO nell'admin

Nuova voce di menu `/admin/seo` con:

- **Stato generale**: punteggio sintetico e elenco dei problemi trovati.
- **Controllo articolo per articolo**: titolo troppo corto/lungo, estratto mancante o fuori misura, immagine di copertina assente, slug poco leggibile, articoli senza categoria. Ogni riga con link diretto alla modifica.
- **Controllo pagine fisse**: titolo, descrizione e anteprima social di Home, Scritti, Libri, Fiabe, Fotografie, Chi sono, Contatti.
- **Anteprima Google**: come appare il risultato nella ricerca (titolo, indirizzo, descrizione).
- **Sitemap e robots**: numero di indirizzi nella sitemap, link per aprirla, verifica che l'indirizzo di base sia quello giusto.
- **Guida pratica**: passi per Google Search Console e cosa fare quando si pubblica un nuovo articolo.

Nota: la sitemap oggi usa l'indirizzo `pierina.friulion.app`, mentre il sito ha il dominio `pierinagallina.it`. Nel lavoro allineo tutto a `https://www.pierinagallina.it` (dimmi se preferisci senza `www`).

## Dettagli tecnici

- Tracciamento visite: tabella nel backend di questo progetto con migrazione (RLS: inserimento consentito a chiunque, lettura solo agli admin, GRANT espliciti); scrittura tramite server function per non esporre dati; lettura aggregata nel dashboard.
- Contenuti (articoli, poesie, ecc.) restano sul database originale: nessuna modifica lì.
- Nuove pagine: `src/routes/admin.seo.tsx`, componenti statistiche riusabili; modifiche a `admin.index.tsx`, `admin.posts.tsx`, `admin.newsletter.tsx`, `admin.tsx` (menu), `sitemap[.]xml.ts`.
- Nessun cookie di tracciamento: identificativo di sessione temporaneo in `sessionStorage`, compatibile con la privacy policy esistente.
