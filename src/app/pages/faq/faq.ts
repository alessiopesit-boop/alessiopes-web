import { Component, DOCUMENT, DestroyRef, afterNextRender, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, RevealDirective],
  templateUrl: './faq.html',
})
export class Faq {
  private readonly doc = inject(DOCUMENT);

  constructor() {
    // Genera il JSON-LD FAQPage dalle domande in pagina (single source: faq.html),
    // per renderle candidabili ai rich snippet di Google. Iniettato lato browser.
    afterNextRender(() => this.injectSchema());
    inject(DestroyRef).onDestroy(() => this.removeSchema());
  }

  private injectSchema(): void {
    this.removeSchema();
    const items = Array.from(this.doc.querySelectorAll('.faq details'))
      .map((d) => ({
        q: (d.querySelector('summary')?.textContent ?? '').replace(/\s*\+\s*$/, '').trim(),
        a: (d.querySelector('.ans')?.textContent ?? '').trim(),
      }))
      .filter((x) => x.q && x.a);
    if (!items.length) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((x) => ({
        '@type': 'Question',
        name: x.q,
        acceptedAnswer: { '@type': 'Answer', text: x.a },
      })),
    };

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-faq-schema', '');
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  private removeSchema(): void {
    this.doc.querySelector('script[data-faq-schema]')?.remove();
  }
}
