import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { PromoService } from '../../core/promo.service';

@Component({
  selector: 'app-servizi',
  imports: [RouterLink, RevealDirective],
  templateUrl: './servizi.html',
})
export class Servizi {
  readonly promo = inject(PromoService);
}
