import {
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../core/theme.service';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
})
export class Nav {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);

  readonly links: NavItem[] = [
    { path: '/servizi', label: 'Servizi e prezzi' },
    // MVP: voce 'Progetti' nascosta finché non ci sono progetti reali (riattiva togliendo il commento).
    // { path: '/progetti', label: 'Progetti' },
    { path: '/chi-sono', label: 'Chi sono' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contatti', label: 'Contatti' },
  ];

  constructor() {
    // chiude il menu mobile a ogni cambio pagina
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    });
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.menuOpen.set(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 760) this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.menuOpen()) return;
    if (!this.host.nativeElement.contains(e.target as Node)) this.menuOpen.set(false);
  }
}
