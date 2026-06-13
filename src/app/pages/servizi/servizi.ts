import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-servizi',
  imports: [RouterLink, RevealDirective],
  templateUrl: './servizi.html',
})
export class Servizi {}
