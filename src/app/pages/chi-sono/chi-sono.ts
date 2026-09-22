import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-chi-sono',
  imports: [RouterLink, RevealDirective],
  templateUrl: './chi-sono.html',
})
export class ChiSono {}
