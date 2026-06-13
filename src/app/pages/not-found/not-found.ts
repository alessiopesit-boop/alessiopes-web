import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticleNetwork } from '../../shared/particle-network/particle-network';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ParticleNetwork],
  templateUrl: './not-found.html',
})
export class NotFound {}
