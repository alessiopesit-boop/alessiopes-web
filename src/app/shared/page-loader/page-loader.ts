import { Component, inject, signal } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.html',
})
export class PageLoader {
  private readonly router = inject(Router);
  readonly show = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        // Nessuna animazione forzata: il loader compare SOLO se il caricamento
        // dura davvero (oltre ~120ms). Sui passaggi istantanei non si vede.
        this.clear();
        this.timer = setTimeout(() => this.show.set(true), 120);
      } else if (
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ) {
        this.clear();
        this.show.set(false);
      }
    });
  }

  private clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
