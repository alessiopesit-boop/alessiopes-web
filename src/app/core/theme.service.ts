import { Injectable, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'ap-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Tema corrente. Default dark (anche in SSR/prerender). */
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (this.isBrowser) {
      let saved: Theme = 'dark';
      try {
        saved = (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
      } catch {
        /* localStorage non disponibile */
      }
      this.theme.set(saved);

      // Riflette il tema sul documento e lo persiste a ogni cambio.
      effect(() => {
        const t = this.theme();
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        try {
          localStorage.setItem(STORAGE_KEY, t);
        } catch {
          /* ignore */
        }
      });
    }
  }

  toggle(): void {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }
}
