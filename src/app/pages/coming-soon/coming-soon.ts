import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.html',
})
export class ComingSoon {
  private readonly route = inject(ActivatedRoute);
  readonly label: string = this.route.snapshot.data['soon'] ?? 'Pagina';
}
