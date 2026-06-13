import { Component, input } from '@angular/core';

/**
 * Segnaposto immagine statico (niente drag&drop in questo MVP).
 * Quando ci sarà uno storage, qui si potrà caricare/mostrare l'immagine reale.
 * Il selettore `image-slot` riusa gli stili globali già presenti.
 */
@Component({
  selector: 'image-slot',
  template: `
    <div class="islot-ph">
      <span class="islot-ico" aria-hidden="true">▤</span>
      <span class="islot-txt mono">{{ placeholder() }}</span>
    </div>
  `,
})
export class ImageSlot {
  readonly placeholder = input('anteprima in arrivo');
}
