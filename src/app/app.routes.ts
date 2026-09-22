import { Routes } from '@angular/router';
import { ARTICLE_BY_SLUG } from './core/blog.data';

const QUANTO_COSTA = ARTICLE_BY_SLUG['quanto-costa-un-sito-web'];
const WP_SU_MISURA = ARTICLE_BY_SLUG['wordpress-o-sito-su-misura'];
const SITO_O_FB = ARTICLE_BY_SLUG['sito-web-o-pagina-facebook'];
const TROVARE_GOOGLE = ARTICLE_BY_SLUG['farsi-trovare-su-google'];
const SITO_VETRINA = ARTICLE_BY_SLUG['sito-vetrina-cos-e-a-chi-serve'];
const COSTO_ECOMMERCE = ARTICLE_BY_SLUG['quanto-costa-un-ecommerce'];
const AI_SITO = ARTICLE_BY_SLUG['ai-per-fare-un-sito-web'];
const RIFARE_SITO = ARTICLE_BY_SLUG['quando-rifare-il-sito-web'];

export const routes: Routes = [
  {
    path: '',
    title: 'Realizzazione siti web e software su misura · Alessio Pes',
    data: {
      description:
        'Realizzazione di siti web, gestionali e app su misura per attività e aziende: veloci, sicuri e davvero tuoi, senza WordPress. Segue tutto una persona sola.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'servizi',
    title: 'Prezzi siti web, e-commerce e software · Alessio Pes',
    data: {
      description:
        'Quanto costa un sito web, un e-commerce o un gestionale su misura: servizi, cosa includono e prezzi chiari. Niente WordPress, tutto davvero tuo.',
    },
    loadComponent: () => import('./pages/servizi/servizi').then((m) => m.Servizi),
  },
  {
    path: 'progetti',
    title: 'Progetti · Alessio Pes',
    data: {
      description:
        'Il mio primo sito per un cliente (vetrina per un termoidraulico) più due progetti personali in Angular. Esempi reali di come lavoro, online e visitabili.',
    },
    loadComponent: () => import('./pages/progetti/progetti').then((m) => m.Progetti),
  },
  {
    path: 'blog',
    title: 'Guide e articoli · Alessio Pes',
    data: {
      description:
        'Guide pratiche su siti web, costi e farsi trovare su Google, in parole semplici per chi ha un\'attività o una P.IVA. Niente fuffa, solo cose utili.',
    },
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
  },
  {
    path: 'blog/quanto-costa-un-ecommerce',
    title: COSTO_ECOMMERCE.title + ' · Alessio Pes',
    data: { description: COSTO_ECOMMERCE.description, article: COSTO_ECOMMERCE },
    loadComponent: () =>
      import('./pages/blog/quanto-costa-un-ecommerce/quanto-costa-un-ecommerce').then(
        (m) => m.QuantoCostaUnEcommerce,
      ),
  },
  {
    path: 'blog/quanto-costa-un-sito-web',
    title: QUANTO_COSTA.title + ' · Alessio Pes',
    data: { description: QUANTO_COSTA.description, article: QUANTO_COSTA },
    loadComponent: () =>
      import('./pages/blog/quanto-costa-un-sito-web/quanto-costa-un-sito-web').then(
        (m) => m.QuantoCostaUnSitoWeb,
      ),
  },
  {
    path: 'blog/wordpress-o-sito-su-misura',
    title: WP_SU_MISURA.title + ' · Alessio Pes',
    data: { description: WP_SU_MISURA.description, article: WP_SU_MISURA },
    loadComponent: () =>
      import('./pages/blog/wordpress-o-sito-su-misura/wordpress-o-sito-su-misura').then(
        (m) => m.WordpressOSitoSuMisura,
      ),
  },
  {
    path: 'blog/sito-web-o-pagina-facebook',
    title: SITO_O_FB.title + ' · Alessio Pes',
    data: { description: SITO_O_FB.description, article: SITO_O_FB },
    loadComponent: () =>
      import('./pages/blog/sito-web-o-pagina-facebook/sito-web-o-pagina-facebook').then(
        (m) => m.SitoWebOPaginaFacebook,
      ),
  },
  {
    path: 'blog/farsi-trovare-su-google',
    title: TROVARE_GOOGLE.title + ' · Alessio Pes',
    data: { description: TROVARE_GOOGLE.description, article: TROVARE_GOOGLE },
    loadComponent: () =>
      import('./pages/blog/farsi-trovare-su-google/farsi-trovare-su-google').then(
        (m) => m.FarsiTrovareSuGoogle,
      ),
  },
  {
    path: 'blog/sito-vetrina-cos-e-a-chi-serve',
    title: SITO_VETRINA.title + ' · Alessio Pes',
    data: { description: SITO_VETRINA.description, article: SITO_VETRINA },
    loadComponent: () =>
      import('./pages/blog/sito-vetrina-cos-e-a-chi-serve/sito-vetrina-cos-e-a-chi-serve').then(
        (m) => m.SitoVetrinaCosEAChiServe,
      ),
  },
  {
    path: 'blog/ai-per-fare-un-sito-web',
    title: AI_SITO.title + ' · Alessio Pes',
    data: { description: AI_SITO.description, article: AI_SITO },
    loadComponent: () =>
      import('./pages/blog/ai-per-fare-un-sito-web/ai-per-fare-un-sito-web').then(
        (m) => m.AiPerFareUnSito,
      ),
  },
  {
    path: 'blog/quando-rifare-il-sito-web',
    title: RIFARE_SITO.title + ' · Alessio Pes',
    data: { description: RIFARE_SITO.description, article: RIFARE_SITO },
    loadComponent: () =>
      import('./pages/blog/quando-rifare-il-sito-web/quando-rifare-il-sito-web').then(
        (m) => m.QuandoRifareIlSito,
      ),
  },
  {
    path: 'chi-sono',
    title: 'Chi sono · Alessio Pes',
    data: {
      description:
        'Sono Alessio Pes: sviluppatore full-stack che costruisce siti, gestionali e app su misura per attività e aziende, seguendo ogni progetto dallo sviluppo fino all\'infrastruttura online.',
    },
    loadComponent: () => import('./pages/chi-sono/chi-sono').then((m) => m.ChiSono),
  },
  {
    path: 'preventivo',
    title: 'Preventivo sito web online e gratis · Alessio Pes',
    data: {
      description:
        'Calcola online il preventivo del tuo sito web in un minuto: scegli cosa ti serve e hai una stima chiara, gratis e senza impegno, poi me la mandi su WhatsApp.',
    },
    loadComponent: () => import('./pages/preventivo/preventivo').then((m) => m.Preventivo),
  },
  {
    path: 'google',
    title: 'Farsi trovare su Google: Profilo e Google Ads · Alessio Pes',
    data: {
      description:
        'Farsi trovare su Google con Profilo Google, Google Ads e Local Services Ads: come funzionano, quanto costano e da dove conviene partire per la tua attività.',
    },
    loadComponent: () => import('./pages/google/google').then((m) => m.Google),
  },
  {
    path: 'faq',
    title: 'Domande frequenti · Alessio Pes',
    data: {
      description:
        'Tutte le risposte su prezzi, tempi, pagamenti, proprietà del sito e assistenza. Quello che vuoi sapere prima ancora di scrivermi.',
    },
    loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'contatti',
    title: 'Contatti · Alessio Pes',
    data: {
      description:
        'Scrivimi su WhatsApp o via email e raccontami la tua attività: ti rispondo con un\'idea concreta, tempi e prezzo, di solito in giornata.',
    },
    loadComponent: () => import('./pages/contatti/contatti').then((m) => m.Contatti),
  },
  {
    path: 'privacy',
    title: 'Privacy & cookie · Alessio Pes',
    data: {
      description:
        'Informativa privacy e cookie del sito di Alessio Pes: quali dati tratto, come e i tuoi diritti. Solo cookie tecnici e statistiche anonime, nessuna profilazione.',
    },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: '**',
    title: 'Pagina non trovata · Alessio Pes',
    data: {
      description:
        'La pagina che cerchi non esiste o è stata spostata. Torna alla home o esplora servizi, preventivo e contatti.',
    },
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
