import { Routes } from '@angular/router';
import { ARTICLE_BY_SLUG } from './core/blog.data';

const QUANTO_COSTA = ARTICLE_BY_SLUG['quanto-costa-un-sito-web'];

export const routes: Routes = [
  {
    path: '',
    title: 'Alessio Pes · Siti web e software su misura per la tua attività',
    data: {
      description:
        'Realizzo siti web, gestionali e app su misura per piccole attività e P.IVA. Tutto custom, niente WordPress: dal primo incontro al sito online, sempre io.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'servizi',
    title: 'Servizi e prezzi · Alessio Pes',
    data: {
      description:
        'Sito vetrina, e-commerce, portali e app su misura: cosa includono, quanto costano e cosa resta a te ogni anno. Prezzi chiari, niente WordPress.',
    },
    loadComponent: () => import('./pages/servizi/servizi').then((m) => m.Servizi),
  },
  {
    path: 'progetti',
    title: 'Progetti · Alessio Pes',
    data: {
      description:
        'Progetti che ho costruito da zero e messo online: una demo e-commerce e una web app in Angular. Esempi reali di come lavoro, visitabili davvero.',
    },
    loadComponent: () => import('./pages/progetti/progetti').then((m) => m.Progetti),
  },
  {
    path: 'blog',
    title: 'Guide e articoli · Alessio Pes',
    data: {
      description:
        'Guide pratiche su siti web, costi e farsi trovare su Google, in parole semplici per chi ha una piccola attività o P.IVA. Niente fuffa, solo cose utili.',
    },
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
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
    path: 'chi-sono',
    title: 'Chi sono · Alessio Pes',
    data: {
      description:
        'Sono Alessio Pes: sviluppatore che costruisce siti e software su misura per piccole attività, seguendo ogni progetto dall\'idea fino al server online.',
    },
    loadComponent: () => import('./pages/chi-sono/chi-sono').then((m) => m.ChiSono),
  },
  {
    path: 'preventivo',
    title: 'Calcola il preventivo · Alessio Pes',
    data: {
      description:
        'Scegli cosa ti serve e ottieni una stima del tuo sito in un minuto. Indicativa e senza impegno: poi me la mandi su WhatsApp.',
    },
    loadComponent: () => import('./pages/preventivo/preventivo').then((m) => m.Preventivo),
  },
  {
    path: 'google',
    title: 'Farsi trovare su Google · Alessio Pes',
    data: {
      description:
        'Farsi trovare su Google con Profilo Google, Google Ads e Local Services Ads: come funzionano, quanto costano e cosa conviene alla tua attività.',
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
