import { DOCUMENT, Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import type { Article } from './blog.data';

/** Dominio di produzione: usato per canonical e og:url assoluti. */
const ORIGIN = 'https://alessiopes.it';
const DEFAULT_DESC =
  'Siti web, gestionali e app su misura per attività e aziende: veloci, sicuri e davvero tuoi, senza WordPress. Sviluppo e infrastruttura seguiti da una persona sola: io.';

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
    // GitHub Pages serve ogni rotta come directory (/privacy -> /privacy/index.html) e fa un
    // 301 verso lo slash finale: la forma canonica ha quindi lo slash, così sitemap, canonical
    // e og:url combaciano con la URL che risponde 200 (niente "pagina con reindirizzamento").
    const path = this.router.url.split('#')[0].split('?')[0];
    const url = ORIGIN + (path.endsWith('/') ? path : path + '/');

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

    this.applyArticle((snapshot.data['article'] as Article | undefined) ?? null, url);
  }

  /** Meta e JSON-LD specifici degli articoli (og:type=article + dati strutturati). */
  private applyArticle(article: Article | null, url: string): void {
    this.meta.updateTag({ property: 'og:type', content: article ? 'article' : 'website' });

    const artTags = ['article:published_time', 'article:modified_time', 'article:author', 'article:section'];
    if (article) {
      this.meta.updateTag({ property: 'article:published_time', content: article.datePublished });
      this.meta.updateTag({ property: 'article:modified_time', content: article.dateModified });
      this.meta.updateTag({ property: 'article:author', content: 'Alessio Pes' });
      this.meta.updateTag({ property: 'article:section', content: article.category });
    } else {
      artTags.forEach((p) => this.meta.removeTag(`property='${p}'`));
    }

    let script = this.doc.getElementById('ld-article');
    if (!article) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.id = 'ld-article';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(this.articleGraph(article, url));
  }

  private articleGraph(a: Article, url: string): unknown {
    const graph: unknown[] = [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        datePublished: a.datePublished,
        dateModified: a.dateModified,
        inLanguage: 'it-IT',
        articleSection: a.category,
        keywords: a.keywords,
        author: {
          '@type': 'Person',
          name: 'Alessio Pes',
          jobTitle: 'Sviluppatore web e software su misura',
          url: ORIGIN + '/chi-sono/',
        },
        publisher: { '@type': 'Person', name: 'Alessio Pes', url: ORIGIN + '/' },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: ORIGIN + '/' },
          { '@type': 'ListItem', position: 2, name: 'Guide', item: ORIGIN + '/blog/' },
          { '@type': 'ListItem', position: 3, name: a.crumb, item: url },
        ],
      },
    ];
    if (a.faq?.length) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: a.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      });
    }
    return { '@context': 'https://schema.org', '@graph': graph };
  }
}
