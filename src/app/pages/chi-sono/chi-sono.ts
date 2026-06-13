import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageSlot } from '../../shared/image-slot/image-slot';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-chi-sono',
  imports: [RouterLink, ImageSlot, RevealDirective],
  templateUrl: './chi-sono.html',
})
export class ChiSono {}
