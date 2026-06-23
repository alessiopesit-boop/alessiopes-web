import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleNetwork } from '../../shared/particle-network/particle-network';
import { Terminal } from '../../shared/terminal/terminal';
import { ImageSlot } from '../../shared/image-slot/image-slot';
import { RevealDirective } from '../../core/reveal.directive';
import { PromoService } from '../../core/promo.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ParticleNetwork, Terminal, ImageSlot, RevealDirective],
  templateUrl: './home.html',
})
export class Home {
  readonly promo = inject(PromoService);
}
