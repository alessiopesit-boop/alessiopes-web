import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Alessio Pes — Siti web e software su misura per la tua attività',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'servizi',
    title: 'Servizi e prezzi — Alessio Pes',
    loadComponent: () => import('./pages/servizi/servizi').then((m) => m.Servizi),
  },
  {
    path: 'progetti',
    title: 'Progetti — Alessio Pes',
    loadComponent: () => import('./pages/progetti/progetti').then((m) => m.Progetti),
  },
  {
    path: 'chi-sono',
    title: 'Chi sono — Alessio Pes',
    loadComponent: () => import('./pages/chi-sono/chi-sono').then((m) => m.ChiSono),
  },
  {
    path: 'preventivo',
    title: 'Calcola il preventivo — Alessio Pes',
    data: { soon: 'Calcola il preventivo' },
    loadComponent: () => import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'google',
    title: 'Farsi trovare su Google — Alessio Pes',
    data: { soon: 'Farsi trovare su Google' },
    loadComponent: () => import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'faq',
    title: 'Domande frequenti — Alessio Pes',
    data: { soon: 'Domande frequenti' },
    loadComponent: () => import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: 'contatti',
    title: 'Contatti — Alessio Pes',
    loadComponent: () => import('./pages/contatti/contatti').then((m) => m.Contatti),
  },
  {
    path: 'privacy',
    title: 'Privacy & cookie — Alessio Pes',
    data: { soon: 'Privacy & cookie' },
    loadComponent: () => import('./pages/coming-soon/coming-soon').then((m) => m.ComingSoon),
  },
  {
    path: '**',
    title: 'Pagina non trovata — Alessio Pes',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
