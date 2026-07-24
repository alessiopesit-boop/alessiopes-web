/**
 * Registro centrale degli articoli/guide del blog.
 *
 * Una sola fonte per: indice `/blog`, rotte `/blog/<slug>`, meta SEO (title,
 * description, JSON-LD Article/FAQ), "guide correlate" e sitemap.
 *
 * Per aggiungere un articolo: 1) aggiungi una voce qui; 2) crea il componente
 * pagina in `pages/blog/<slug>/` che usa `<app-article slug="...">`;
 * 3) aggiungi la rotta in `app.routes.ts` e l'URL in `public/sitemap.xml`.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  /** Title del tab + og:title (senza suffisso brand, lo aggiunge la rotta). */
  title: string;
  /** <h1> dell'articolo (può differire dal title SEO). */
  h1: string;
  /** Sottotitolo/dek sotto l'h1. */
  dek: string;
  /** Meta description (~150-160 caratteri). */
  description: string;
  /** Etichetta categoria, es. "Guida · Prezzi". */
  category: string;
  /** Foglia delle briciole + voce nell'indice, es. "Quanto costa un sito web". */
  crumb: string;
  /** ISO yyyy-mm-dd: prima pubblicazione (non cambiarla più). */
  datePublished: string;
  /** ISO yyyy-mm-dd: ultima revisione vera. */
  dateModified: string;
  /** Data leggibile per la UI, es. "24 giugno 2026". */
  dateLabel: string;
  /** Stima minuti di lettura (mostrata nell'indice; l'articolo la calcola live). */
  readingMin: number;
  keywords?: string;
  /** FAQ: DEVONO combaciare 1:1 con quelle visibili nell'articolo. */
  faq?: FaqItem[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'quanto-costa-un-ecommerce',
    title: 'Quanto costa un e-commerce nel 2026? Prezzi reali',
    h1: 'Quanto costa un e-commerce nel 2026? La guida ai prezzi reali',
    dek: 'Aprire un negozio online: cifre vere per un e-commerce sul tuo gestionale o su misura, cosa fa salire il conto, i costi che restano ogni anno e dove si perdono (o si guadagnano) le vendite.',
    description:
      'Quanto costa un e-commerce nel 2026? Prezzi reali per aprire un negozio online su misura o sul tuo gestionale, i costi annui e il budget marketing spiegati chiari.',
    category: 'Guida · Prezzi',
    crumb: 'Quanto costa un e-commerce',
    datePublished: '2026-07-24',
    dateModified: '2026-07-24',
    dateLabel: '24 luglio 2026',
    readingMin: 5,
    keywords: 'quanto costa un e-commerce, prezzo negozio online, aprire un e-commerce, costo shop online',
    faq: [
      {
        q: 'Meglio una piattaforma pronta (Shopify) o un e-commerce su misura?',
        a: "Una piattaforma pronta parte in fretta, ma ha un canone che cresce con app e commissioni e resta \"in affitto\". Un e-commerce su misura costa di più all'inizio ma è tuo, più veloce e senza canoni a sorpresa: si può anche costruire sopra la piattaforma o il gestionale che già usi, così non rifai il magazzino. Conviene quando fai volumi o vuoi qualcosa di diverso dal negozio standard.",
      },
      {
        q: 'Ho già un gestionale: posso venderci online sopra?',
        a: 'Sì, ed è spesso la scelta migliore: si costruisce il negozio sopra il gestionale che già usi (headless), così prodotti, prezzi e magazzino li gestisci come sempre da un unico posto, senza doppio lavoro né migrazioni.',
      },
      {
        q: 'Quanto costa mantenere un e-commerce ogni anno?',
        a: "Più di una vetrina: serve un server vero (qualche centinaio di euro l'anno) perché il negozio deve reggere traffico, pagamenti e ordini insieme. A parte c'è il budget pubblicitario, che va a Google o Meta e decidi tu: un negozio senza visite non vende.",
      },
    ],
  },
  {
    slug: 'quanto-costa-un-sito-web',
    title: 'Quanto costa un sito web nel 2026? Guida ai prezzi reali',
    h1: 'Quanto costa un sito web nel 2026? La guida ai prezzi reali',
    dek: 'Cifre vere, non "a partire da" buttati a caso: quanto spendere per un sito vetrina, un e-commerce o un gestionale, cosa fa salire il conto e dove puoi risparmiare senza pentirtene.',
    description:
      'Quanto costa davvero un sito web per una piccola attività nel 2026? Prezzi reali per vetrina, e-commerce e gestionale, cosa li fa salire e come non pagare troppo.',
    category: 'Guida · Prezzi',
    crumb: 'Quanto costa un sito web',
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    dateLabel: '24 giugno 2026',
    readingMin: 4,
    keywords: 'quanto costa un sito web, prezzi sito web, costo e-commerce, preventivo sito',
    faq: [
      {
        q: 'Un sito economico va bene per iniziare?',
        a: 'Per partire può bastare, ma un sito troppo economico spesso è lento, fragile e difficile da far crescere: il rischio è rifarlo dopo un anno e pagarlo due volte. Meglio una base solida, anche piccola.',
      },
      {
        q: 'Quanto costa mantenere il sito ogni anno?',
        a: 'Per un sito vetrina servono dominio e hosting, circa 90€/anno. Portali ed e-commerce costano di più perché richiedono un server. La manutenzione è sempre facoltativa.',
      },
      {
        q: 'Perché non usi WordPress se costa meno?',
        a: "All'inizio sembra più economico, ma porta plugin a pagamento, aggiornamenti continui e i problemi di sicurezza più diffusi al mondo. Su misura è più veloce, più sicuro e davvero tuo.",
      },
    ],
  },
  {
    slug: 'wordpress-o-sito-su-misura',
    title: 'WordPress o sito su misura: cosa conviene davvero',
    h1: 'WordPress o sito su misura: cosa conviene davvero',
    dek: 'Quando WordPress basta e quando ti costa più di quello che risparmi: velocità, sicurezza, controllo e costi nel tempo, spiegati senza tecnicismi.',
    description:
      'WordPress o sito su misura per la tua attività? Differenze reali su velocità, sicurezza, costi nel tempo e proprietà, spiegate semplici per scegliere bene.',
    category: 'Guida · Scelte',
    crumb: 'WordPress o sito su misura',
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    dateLabel: '24 giugno 2026',
    readingMin: 4,
    keywords: 'wordpress o sito su misura, sito custom, wordpress sicurezza, sito veloce',
    faq: [
      {
        q: 'WordPress è davvero meno sicuro?',
        a: 'È il sistema più usato al mondo, quindi anche il più attaccato: i plugin di terze parti sono la porta d\'ingresso più comune. Va aggiornato spesso e con attenzione. Un sito su misura non espone quelle stesse falle note.',
      },
      {
        q: 'Ho già un sito WordPress: devo per forza rifarlo?',
        a: 'No. Se funziona, è veloce e lo gestisci bene, tienilo. Ha senso rifarlo quando è lento, ti dà problemi di sicurezza o ti blocca: in quel caso, partire da una base su misura ti evita di rifarlo di nuovo tra un anno.',
      },
    ],
  },
  {
    slug: 'sito-web-o-pagina-facebook',
    title: 'Sito web o pagina Facebook? Perché ti serve un sito',
    h1: 'Sito web o pagina Facebook? Perché alla tua attività serve un sito',
    dek: 'La pagina social è di chi te la ospita, il sito è tuo. Cosa cambia per farti trovare su Google, per la credibilità e per non perdere i contatti dei clienti.',
    description:
      'Basta la pagina Facebook o serve un sito? Differenze su visibilità su Google, credibilità e controllo dei tuoi dati, per chi ha una piccola attività.',
    category: 'Guida · Avvio',
    crumb: 'Sito o pagina Facebook',
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    dateLabel: '24 giugno 2026',
    readingMin: 4,
    keywords: 'sito o pagina facebook, sito web piccola attività, pagina facebook azienda',
    faq: [
      {
        q: 'La pagina Facebook non basta?',
        a: 'Per parlare con chi già ti segue va benissimo. Ma non compare bene su Google quando qualcuno cerca il tuo servizio, e la pagina (con i suoi contatti) è di Meta, non tua: regole e visibilità le decidono loro. Il sito resta tuo e ti fa trovare.',
      },
      {
        q: 'Posso avere sia sito che social?',
        a: 'Sì, ed è la cosa migliore: il sito è la tua casa (sempre raggiungibile, tua), i social sono i canali da cui porti le persone al sito. Si rafforzano a vicenda.',
      },
    ],
  },
  {
    slug: 'farsi-trovare-su-google',
    title: 'Farsi trovare su Google: la guida per piccole attività',
    h1: 'Farsi trovare su Google: la guida per piccole attività',
    dek: 'Profilo Google, posizionamento naturale e pubblicità: cosa sono, quanto costano e da dove conviene partire per farti trovare da chi cerca quello che offri.',
    description:
      'Come farsi trovare su Google con una piccola attività: Profilo Google, SEO e Google Ads spiegati semplici, con costi reali e da dove iniziare.',
    category: 'Guida · Google',
    crumb: 'Farsi trovare su Google',
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    dateLabel: '24 giugno 2026',
    readingMin: 5,
    keywords: 'farsi trovare su google, profilo google, google ads piccole attività, seo locale',
    faq: [
      {
        q: 'Da dove conviene iniziare?',
        a: 'Dal Profilo Google (la scheda con mappa, orari e recensioni): è gratis, serve a tutti ed è spesso il passo più importante per le ricerche locali. Poi, se servono clienti subito, si affianca la pubblicità.',
      },
      {
        q: 'Quanto budget serve per la pubblicità?',
        a: 'Molte attività locali partono con ~10-15€ al giorno su Google Ads. Il budget è tuo, va direttamente a Google e lo decidi (e lo fermi) tu quando vuoi.',
      },
    ],
  },
  {
    slug: 'sito-vetrina-cos-e-a-chi-serve',
    title: "Sito vetrina: cos'è, a chi serve e cosa deve avere",
    h1: "Sito vetrina: cos'è, a chi serve e cosa deve avere",
    dek: 'Il sito più semplice e più richiesto: cosa contiene, per quali attività è perfetto e quali elementi non possono mancare per trasformarlo in contatti veri.',
    description:
      "Cos'è un sito vetrina, a chi serve e cosa deve avere per portare contatti: pagine, mobile, Google e modulo contatti, spiegato per piccole attività.",
    category: 'Guida · Basi',
    crumb: "Sito vetrina: cos'è",
    datePublished: '2026-06-24',
    dateModified: '2026-06-24',
    dateLabel: '24 giugno 2026',
    readingMin: 4,
    keywords: "sito vetrina, cos'è un sito vetrina, sito vetrina prezzo, sito per piccola attività",
    faq: [
      {
        q: 'Quante pagine ha un sito vetrina?',
        a: 'Di solito poche e mirate: home, servizi, chi siamo, contatti e a volte una galleria. Contano più la chiarezza e i percorsi verso il contatto che il numero di pagine.',
      },
      {
        q: 'Un sito vetrina basta per farsi trovare su Google?',
        a: "È la base giusta: se fatto bene (veloce, mobile, testi chiari) aiuta molto. Per le ricerche locali si abbina al Profilo Google. La pubblicità è un passo successivo e facoltativo.",
      },
    ],
  },
];

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);
