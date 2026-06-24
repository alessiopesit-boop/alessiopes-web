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
];

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);
