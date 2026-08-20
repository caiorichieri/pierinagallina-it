# Aggiornamento testi: Home, Chi sono, Libri

Applico i testi inviati dalla cliente, senza toccare grafica, animazioni o struttura del sito.

## 1. Homepage

- Titolo principale: **Pierina Gallina** / *Tessitrice di storie* / "Giornalista, scrittrice, poetessa" al posto di "Scrittrice e paroliera".
- Resta la frase: "Scrivo per dare voce a ciò che rischierebbe di passare inosservato."
- Il paragrafo sotto viene allineato alla nuova identità (giornalista, scrittrice, poetessa — Codroipo, Friuli).
- Sezione sentieri: tolgo **Fotografie** dalle card (resta nel menu in alto). Restano tre card: Libri, Scritti, Fiabe sonore.
  - Titolo: "Tre sentieri di parole."
  - Testo: "I miei libri illustrati, fiabe da ascoltare, poesie in italiano e, a volte, anche in friulano, blog. Scegli da dove cominciare."
- Restano le sezioni esistenti: Chi sono (breve) con link "Leggi di più", Libri in anteprima, Scritti in anteprima, chiusura.

## 2. Chi sono

Sostituisco integralmente il testo attuale con quello inviato: 42 anni di insegnamento nella Scuola dell'Infanzia (36 a Rivolto-Codroipo), oltre quarant'anni di collaborazione giornalistica con Messaggero Veneto, Il Ponte e Il Paese, i nove libri, il Premio Andersen, la famiglia, la nascita nel 1952 a Codroipo. Titolo della pagina e sottotitolo allineati a "Tessitrice di storie".

## 3. Libri

- Introduzione della pagina: "I miei libri sono emozioni fatte parole. Poesie, racconti, fiabe e saggi nascono dall'ascolto della vita."
- Ogni libro riceve la descrizione inviata dalla cliente (Come aerei di carta, Come petali di luna, Come angeli in vacanza, Il volo perfetto di Massimo il Folletto, La Principessa TIC e il Pirata TAC, NONNI, Un anno da Fiaba, Gastone, Vita da emotiva), con editore, associazione beneficiaria e la nota "basta chiedermela".
- L'indirizzo indicato per richiedere le copie sarà **padovani@qnetmail.it**.
- "Fata Natura e l'orto magico" viene nascosto dalla pagina Libri, in attesa del testo.
- I link d'acquisto Protos restano attivi per Gastone e Vita da emotiva; per gli altri resta il pulsante di richiesta copia.
- Sotto "Un anno da Fiaba" aggiungo il rimando alle Fiabe sonore del sito.

## Note tecniche

- I testi dei libri vengono gestiti come override in codice (stesso schema già usato per le copertine), così restano stabili anche se il database contiene ancora le vecchie descrizioni; il campo del database resta come fallback.
- Aggiorno i meta tag (title/description/og) di Home, Chi sono e Libri con la nuova definizione "Giornalista, scrittrice, poetessa" e i dati strutturati della persona.
- Nessuna modifica al database, al pannello admin o alle animazioni.
