import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Reveal on-scroll: aggiunge la classe `.in` quando l'elemento entra in vista.
 * Si applica automaticamente a ogni elemento con classe `.reveal`.
 * Solo lato browser (in SSR/prerender il contenuto resta nel DOM).
 */
@Directive({
  selector: '.reveal',
})
export class RevealDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement as HTMLElement;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      io.observe(node);
    });
  }
}
