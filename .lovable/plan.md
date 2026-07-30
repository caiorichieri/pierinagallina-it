## Obiettivo

Rendere la home su mobile più armoniosa e sostituire le icone generiche della sezione "Il mio mondo" con illustrazioni line-art su misura.

## 1. Hero mobile — foto grande sotto i testi

Struttura mobile (in ordine verticale):

```text
  Pierina
  Gallina.
  "Scrivo per dare voce a ciò che
   rischierebbe di passare inosservato."
  [breve paragrafo]
  [Leggi gli scritti] [Scrivimi]
  ────────────────────────────
       foto di Pierina
   (larga quasi tutto lo schermo)
   che sfuma nello sfondo carta
```

- Rimuovo la foto affiancata al titolo (il blocco `md:hidden` attuale accanto all'h1) e la sposto sotto i pulsanti.
- La foto diventa larga circa il 90% dello schermo, centrata, con alone dorato radiale dietro.
- Il taglio netto in basso viene risolto con una **maschera a sfumatura**: la foto svanisce gradualmente nel colore carta (`mask-image: linear-gradient(to bottom, black 65%, transparent 100%)`), così non c'è più il bordo dritto.
- Riduco il padding inferiore dell'hero perché la foto stessa chiude la sezione.
- Il layout desktop resta esattamente com'è oggi (foto a destra, ingrandita), ma applico la stessa sfumatura in basso per coerenza estetica.

## 2. Sezione "Il mio mondo" — icone disegnate a mano

- Genero 4 illustrazioni line-art dorate su sfondo trasparente, stile inchiostro/penna sottile, coerenti tra loro:
  - **Libri** — pila di libri aperti
  - **Scritti** — penna stilografica con svolazzo
  - **Fiabe sonore** — cuffie con onde sonore
  - **Fotografie** — macchina fotografica vintage
- Sostituiscono le icone Lucide dentro le card, mantenendo dimensione e animazione hover (scala + leggera rotazione) già presenti.
- Il contenitore quadrato attuale diventa un cerchio con bordo dorato sottile, così l'illustrazione respira.
- Lascio invariati titoli, descrizioni, link e il resto della griglia.

## Dettagli tecnici

- File toccati: `src/routes/index.tsx` (struttura hero + card), `src/styles.css` (utility per la maschera sfumata), nuovi asset in `src/assets/icone/`.
- Nessuna modifica al database, alle query o alla logica.
- Verifica finale con screenshot a 393px (mobile) e 1280px (desktop).
