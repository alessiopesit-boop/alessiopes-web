import { DOCUMENT, Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

/** Dominio di produzione: usato per canonical e og:url assoluti. */
const ORIGIN = 'https://alessiopes.it';
const DEFAULT_DESC =
  'Realizzo siti web, gestionali e app su misura per piccole attività e P.IVA. Tutto custom, niente WordPress: dal primo incontro al sito online, sempre io.';

/**
 * Aggiorna description, Open Graph, Twitter card e link canonical a ogni
 * cambio rotta (anche durante il prerender, così ogni pagina statica ha i
 * propri meta). I tag fissi (og:image, site_name, type, JSON-LD) stanno in index.html.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly doc = inject(DOCUMENT);

  init(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.update());
  }

  private update(): void {
    let r = this.route;
    while (r.firstChild) r = r.firstChild;
    const snapshot = r.snapshot;

    const pageTitle = snapshot.title ?? this.title.getTitle();
    const desc = (snapshot.data['description'] as string) || DEFAULT_DESC;
    const url = ORIGIN + this.router.url.split('#')[0].split('?')[0];

    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: desc });

    let canonical = this.doc.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }
}
