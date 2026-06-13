import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-faq',
  imports: [RouterLink, RevealDirective],
  templateUrl: './faq.html',
})
export class Faq {}
