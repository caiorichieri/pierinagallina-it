# Dare vita a "Chi sono" e "Contatti"

Oggi Blog, Fiabe e Fotografie hanno un'illustrazione animata in apertura e un fondo bordeaux, mentre Chi sono e Contatti usano solo l'intestazione testuale standard: per questo sembrano "spente" rispetto al resto del sito. L'idea è dare a ciascuna delle due pagine la stessa firma visiva, senza toccare i contenuti già approvati.

## Chi sono — hero animato "il filo delle storie"

Nuova illustrazione SVG in stile line-art oro su fondo bordeaux, coerente con quelle esistenti:
- Un gomitolo/telaio da cui parte un filo dorato che si disegna progressivamente e si intreccia formando una penna e alcune parole-tracce (richiama "tessitrice di storie").
- Comparsa progressiva con gli stessi tempi e curve delle altre pagine, e rispetto della preferenza di sistema "riduci animazioni".

Sotto l'hero, per togliere l'effetto "muro di testo":
- La frase "Scrivo anche quando non scrivo." diventa una citazione in evidenza su fondo bordeaux con virgolette dorate.
- Il racconto biografico resta identico, ma i paragrafi appaiono in dissolvenza scaglionata durante lo scorrimento.
- Piccola striscia di numeri-chiave (42 anni di scuola, 40+ anni di giornalismo, 9 libri, 7 nipoti) con animazione di entrata, come stacco tra testo e pulsanti.

## Contatti — hero animato "la lettera che parte"

- Illustrazione animata: una busta che si apre, ne esce un foglio con righe scritte a mano che si disegnano, e un piccolo aeroplanino di carta che vola via in loop lento.
- Fondo bordeaux come le altre pagine, con lo stesso trattamento di grana carta.

Modulo e colonna laterale:
- Il form viene ospitato in una "scheda carta" con leggera ombra e bordo dorato, campi che si illuminano in bordeaux/oro al focus.
- Il pulsante Invia ottiene uno stato animato (aeroplanino che parte) e il messaggio di conferma appare in dissolvenza.
- La colonna laterale (Dove sono / Social / firma) diventa un blocco in tono bordeaux con icone dorate, così dialoga con il footer.

## Cosa non cambia

Testi, campi del modulo, invio del messaggio, notifica email, SEO e dati strutturati restano esattamente come sono.

## Dettagli tecnici

- Nuovi componenti `src/components/ChiSonoHero.tsx` e `src/components/ContattiHero.tsx`, sullo stesso schema di `ScrittiHero`/`FotografieHero` (SVG inline + keyframes CSS, nessuna libreria aggiuntiva).
- `src/routes/chi-sono.tsx` e `src/routes/contatti.tsx`: sostituzione di `PageHero` con i nuovi hero, riuso di `Reveal` per lo scaglionamento, restyling delle sezioni esistenti.
- Solo token del design system (`--brand-gold`, primary, accent, gradiente bordeaux); nessun colore hardcoded.
- Keyframes aggiunti in `src/styles.css` accanto a quelli già presenti, con blocco `prefers-reduced-motion`.
