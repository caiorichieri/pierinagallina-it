// Testi dei libri forniti dall'autrice. Hanno la precedenza sulle descrizioni
// presenti nel database (stesso schema usato per le copertine).

export const BOOKS_INTRO =
  "I miei libri sono emozioni fatte parole. Poesie, racconti, fiabe e saggi nascono dall'ascolto della vita.";

export const COPY_EMAIL = "padovani@qnetmail.it";

export type BookText = {
  description: string;
  publisher?: string;
  charity?: string;
  copies?: string;
  extra?: string;
};

function key(title: string) {
  return title.trim().toLowerCase();
}

const ALPI = "Questo libro ha aiutato e aiuta A.L.P.I di Udine, bambini con problemi di respiro.";

const TEXTS: Record<string, BookText> = {
  "come aerei di carta": {
    description:
      "È stato un regalo di mio marito, per i 35 anni di matrimonio. Mi aveva detto: «Raccogli i premi e fanne un libro». Dal 1996 al 2008, 110 premi, contati dopo anni e su richiesta. La meraviglia che provavo nel partecipare ai concorsi letterari, presenziare alle premiazioni e conoscere persone belle di tutta Italia.",
    publisher: "Editore Moro",
    charity: ALPI,
    copies: `Del libro ho poche copie. Basta chiedermele: ${COPY_EMAIL}`,
  },
  "come petali di luna": {
    description:
      "Ho voluto dedicare questo libro ai miei sette nipoti. Tra loro qualcuno scriveva poesie e vinceva concorsi. Il libro raccoglie poesie mie e loro, racconti, racconti di viaggio, recensioni di libri.",
    publisher: "Editrice Orto della Cultura",
    charity: ALPI,
    copies: `Del libro ho ancora copie. Basta chiedermele: ${COPY_EMAIL}`,
  },
  "come angeli in vacanza": {
    description:
      "Qui le poesie sono scintille che arrivano direttamente al cuore. Si specchiano nelle persone e nelle faccende della vita, dove le emozioni fioriscono in una speciale forma di felicità. Che consola, risolve, rasserena.",
    publisher: "Editrice Orto della Cultura",
    charity: ALPI,
    copies: `Del libro ho ancora qualche copia. Basta chiedermela: ${COPY_EMAIL}`,
  },
  "il volo perfetto di massimo il folletto": {
    description:
      "Fiaba dedicata a Massimo, 5 anni, giocatore di rugby, salito in cielo all'improvviso. In una notte soltanto. Lui, un piccolo folletto, che è riuscito a toccare il sole. E poi rimangono le notti blu: notti insonni in cui fargli del latte caldo. Le notti blu: è un bel modo di chiamarle, dopotutto!",
    publisher: "Illustrazioni di Vanessa Padovani e Andrea Dalla Costa. Autopubblicato.",
    charity: ALPI,
    copies: `Ho ancora qualche copia. Basta chiedermela: ${COPY_EMAIL}`,
  },
  "la principessa tic e il pirata tac nel pianeta fifablu": {
    description:
      "Fiaba dedicata alle pareti della Risonanza magnetica dell'ospedale «Santa Maria della Misericordia» di Udine: 80 metri quadri dipinti come il libro. E la paura della TAC se ne va al paese di Fifablu per non tornare mai più.",
    publisher: "Editore Gaspari",
    charity: "Questo libro ha aiutato e aiuta ABIO, Associazione per il bambino in ospedale di Udine.",
    copies: `Ho ancora qualche copia. Basta chiedermela: ${COPY_EMAIL}`,
  },
  nonni: {
    description:
      "Parlo dei nonni degli anni 2000, partendo dalla mia esperienza di nonna di sette nipoti. Nonni fatti di tempo. Nonni visti dal di dentro, nella più autentica umanità di un ruolo non sempre facile come potrebbe sembrare. Quasi un saggio, quasi un libro con qualche istruzione per l'uso. Di sicuro un libro utile ai nonni, ma anche ai loro figli e ai loro nipoti.",
    publisher: "Editore Abacoviaggi",
    charity: ALPI,
    copies: `Chi desidera leggerlo, basta chiedere copia a ${COPY_EMAIL}`,
  },
  "un anno da fiaba": {
    description:
      "52 fiabe contemporanee, illustrate da pittori e fotografi nazionali. Una per ogni giorno del Covid, dal 13 marzo al 3 maggio 2020: ogni giorno ne ho ideata e scritta una, che poi leggevo su WhatsApp alle 20.20, facendo compagnia a bambini di ogni età, fin oltre l'Oceano. Una vera mostra d'arte a libro aperto. Confesso: è il mio orgoglio. Se lo scrivessi ora, forse verrebbe confuso con la AI. Ma allora non esisteva, per fortuna!",
    publisher: "Editore Abacoviaggi",
    charity: ALPI,
    copies: `Chi desidera leggerlo, basta chiedere copia a ${COPY_EMAIL}`,
    extra: "Le fiabe si possono ascoltare qui sul sito, in Fiabe Sonore.",
  },
  "gastone, il tassista coccolone": {
    description:
      "Fiaba per bambini piccoli, ma dal cuore grande. Un maggiolone giallo: di giorno taxi di Gastone, di notte casa-letto per gli uccellini rimasti senza alberi, tagliati per costruire un palazzone. Questa cosa non piace a Gastone né al suo maggiolone. E, allora, ecco che…",
    publisher: "Illustrato da Valentina Bott. Protos Edizioni.",
  },
  "vita da emotiva": {
    description:
      "Un libro-saggio che ho atteso per anni di pubblicare, perché anche io ero convinta che essere sensibili ed emotivi fosse un difetto, qualcosa di cui vergognarsi. Se capita anche a te di pensare la stessa cosa, allora è scritto giusto per convincerti del contrario. Questo libro è prezioso per gli emotivi e per chi sta loro accanto e non sempre riesce a capirli.",
    publisher: "Copertina di Daniela Prezioso Einwaller. Protos Edizioni.",
  },
};

// Libri momentaneamente non pubblicati sul sito (in attesa del testo).
const HIDDEN = new Set(["fata natura e l'orto magico"]);

export function bookTextFor(title: string): BookText | null {
  return TEXTS[key(title)] ?? null;
}

export function isBookHidden(title: string): boolean {
  return HIDDEN.has(key(title));
}
