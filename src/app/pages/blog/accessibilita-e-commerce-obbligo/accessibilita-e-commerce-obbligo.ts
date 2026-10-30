import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-accessibilita-ecommerce',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './accessibilita-e-commerce-obbligo.html',
})
export class AccessibilitaEcommerce {}
