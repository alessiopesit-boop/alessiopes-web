import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Alessio Pes · Siti web e software su misura per la tua attività',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'servizi',
    title: 'Servizi e prezzi · Alessio Pes',
    loadComponent: () => import('./pages/servizi/servizi').then((m) => m.Servizi),
  },
  {
    path: 'progetti',
    title: 'Progetti · Alessio Pes',
    loadComponent: () => import('./pages/progetti/progetti').then((m) => m.Progetti),
  },
  {
    path: 'chi-sono',
    title: 'Chi sono · Alessio Pes',
    loadComponent: () => import('./pages/chi-sono/chi-sono').then((m) => m.ChiSono),
  },
  {
    path: 'preventivo',
    title: 'Calcola il preventivo · Alessio Pes',
    loadComponent: () => import('./pages/preventivo/preventivo').then((m) => m.Preventivo),
  },
  {
    path: 'google',
    title: 'Farsi trovare su Google · Alessio Pes',
    loadComponent: () => import('./pages/google/google').then((m) => m.Google),
  },
  {
    path: 'faq',
    title: 'Domande frequenti · Alessio Pes',
    loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'contatti',
    title: 'Contatti · Alessio Pes',
    loadComponent: () => import('./pages/contatti/contatti').then((m) => m.Contatti),
  },
  {
    path: 'privacy',
    title: 'Privacy & cookie · Alessio Pes',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: '**',
    title: 'Pagina non trovata · Alessio Pes',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
