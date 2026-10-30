import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-magazzino-unico',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './magazzino-unico-negozio-e-ecommerce.html',
})
export class MagazzinoUnico {}
