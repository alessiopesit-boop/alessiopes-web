import { Component, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'ap-cookie-ok';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  templateUrl: './cookie-banner.html',
})
export class CookieBanner {
  /** Il banner viene montato solo lato browser, se non già accettato. */
  readonly visible = signal(false);
  /** Classe .show: attivata con un piccolo delay per l'animazione di entrata. */
  readonly shown = signal(false);

  constructor() {
    afterNextRender(() => {
      let seen = false;
      try {
        seen = localStorage.getItem(STORAGE_KEY) === '1';
      } catch {
        /* ignore */
      }
      if (seen) return;
      this.visible.set(true);
      setTimeout(() => this.shown.set(true), 30);
    });
  }

  accept(): void {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    this.shown.set(false);
    setTimeout(() => this.visible.set(false), 300);
  }
}
