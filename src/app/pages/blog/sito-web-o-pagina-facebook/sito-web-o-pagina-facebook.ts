import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-sito-o-facebook',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './sito-web-o-pagina-facebook.html',
})
export class SitoWebOPaginaFacebook {}
