import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-google',
  imports: [RouterLink, RevealDirective],
  templateUrl: './google.html',
})
export class Google {}
