import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-costo-ecommerce',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './quanto-costa-un-ecommerce.html',
})
export class QuantoCostaUnEcommerce {}
