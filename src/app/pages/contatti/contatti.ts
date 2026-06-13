import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-contatti',
  imports: [RouterLink, RevealDirective],
  templateUrl: './contatti.html',
})
export class Contatti {}
