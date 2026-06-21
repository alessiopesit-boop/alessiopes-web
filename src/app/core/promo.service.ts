import { Injectable, afterNextRender, signal } from '@angular/core';

/**
 * Promo di lancio: sorgente unica per prezzo agevolato, badge e countdown.
 *
 * Per chiudere/spostare la promo basta cambiare END_DATE qui sotto: oltre quella
 * data il sito torna ai prezzi pieni e nasconde badge/sconto/countdown da solo.
 *
 * Il sito e' prerenderizzato (SSG), quindi `daysLeft` viene calcolato solo lato
 * browser (`afterNextRender`): cosi' il conto alla rovescia e' sempre aggiornato
 * alla visita, non congelato al momento della build.
 */
@Injectable({ providedIn: 'root' })
export class PromoService {
  /** Fine promo lancio (incluso). Cambia SOLO questa riga per spostare/chiudere la promo. */
  private static readonly END_DATE = new Date('2026-08-31T23:59:59');

  /** Promo attiva. Default true (prerender mostra i prezzi promo); il browser la spegne se scaduta. */
  readonly active = signal(true);
  /** Giorni rimanenti alla scadenza. 0 finche' non calcolato lato browser. */
  readonly daysLeft = signal(0);

  /** Etichetta statica "fino al 31 agosto 2026" (deterministica, nessun mismatch in hydration). */
  readonly endLabel = PromoService.END_DATE.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  constructor() {
    afterNextRender(() => {
      const ms = PromoService.END_DATE.getTime() - Date.now();
      this.active.set(ms > 0);
      this.daysLeft.set(Math.max(0, Math.ceil(ms / 86_400_000)));
    });
  }
}
