import { Component, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLE_BY_SLUG, ARTICLES, type Article } from '../../core/blog.data';

/**
 * Layout condiviso di un articolo/guida. Ogni pagina-articolo lo usa come
 * <app-article slug="..."> e proietta dentro il contenuto `.prose`.
 *
 * Header, box autore, correlate e CTA sono qui. Indice (TOC), tempo di lettura
 * e barra di avanzamento si generano DA SOLI lato browser (afterNextRender),
 * leggendo gli <h2>/<h3> del contenuto proiettato: in prerender restano vuoti
 * e si riempiono all'hydration (sono un'aggiunta, non rompono nulla).
 */
@Component({
  selector: 'app-article',
  imports: [RouterLink],
  templateUrl: './article.html',
})
export class ArticleComponent {
  readonly slug = input.required<string>();
  private readonly host = inject(ElementRef<HTMLElement>);

  get article(): Article {
    return ARTICLE_BY_SLUG[this.slug()];
  }
  get related(): Article[] {
    return ARTICLES.filter((a) => a.slug !== this.slug()).slice(0, 3);
  }

  constructor() {
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      const prose = root.querySelector('.prose');
      if (!prose) return;

      // Tempo di lettura (~200 parole/min)
      const words = (prose.textContent || '').trim().split(/\s+/).filter(Boolean).length;
      const min = Math.max(1, Math.round(words / 200));
      root.querySelectorAll('[data-reading-time]').forEach((el) => {
        el.textContent = min + ' min di lettura';
      });

      // Indice automatico dagli h2/h3
      const headings = Array.from(prose.querySelectorAll(':scope > h2, :scope > h3')) as HTMLElement[];
      const tocList = root.querySelector('[data-toc]');
      if (tocList && headings.length) {
        const used = new Set<string>();
        headings.forEach((h) => {
          if (!h.id) {
            let base =
              (h.textContent || '')
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-') || 'sezione';
            let id = base;
            let n = 2;
            while (used.has(id)) id = base + '-' + n++;
            used.add(id);
            h.id = id;
          }
          const li = document.createElement('li');
          if (h.tagName === 'H3') li.className = 'sub';
          const a = document.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.textContent;
          a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', '#' + h.id);
          });
          li.appendChild(a);
          tocList.appendChild(li);
        });
      }

      // Barra di avanzamento lettura
      const bar = root.querySelector('.read-progress') as HTMLElement | null;
      if (bar) {
        const onScroll = () => {
          const h = document.documentElement;
          const max = h.scrollHeight - h.clientHeight;
          bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
      }
    });
  }
}
