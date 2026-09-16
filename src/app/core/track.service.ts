import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Endpoint del Cloudflare Worker che riceve il ping e notifica su Telegram.
 * Vuoto = tracking disattivato (no-op). Vedi A:\dev\_business\tracking-cloudflare-worker.md.
 */
const TRACK_ENDPOINT = 'https://ap-track.alessio-pes-it.workers.dev';

/**
 * Tracking dei link di campagna, cookieless. Solo per i link personalizzati che invio
 * (es. alessiopes.it/?c=admirabilia): al caricamento manda un ping "chi ha aperto" all'Apps
 * Script, poi ripulisce l'URL dal parametro. Nessun cookie, nessuna profilazione: se manca
 * il parametro ?c non fa nulla. Gira solo lato browser, per non rompere il prerender.
 */
@Injectable({ providedIn: 'root' })
export class TrackService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    if (!this.isBrowser || !TRACK_ENDPOINT) return;

    let id: string | null = null;
    try {
      id = new URLSearchParams(window.location.search).get('c');
    } catch {
      return;
    }
    if (!id) return;
    id = id.slice(0, 60);

    try {
      new Image().src = `${TRACK_ENDPOINT}?c=${encodeURIComponent(id)}&s=sito&t=${Date.now()}`;
    } catch {
      /* fire-and-forget: se fallisce, pazienza */
    }

    // Rimuove il parametro di tracking dall'URL, senza ricaricare la pagina.
    try {
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname + window.location.hash,
      );
    } catch {
      /* ignore */
    }
  }
}
