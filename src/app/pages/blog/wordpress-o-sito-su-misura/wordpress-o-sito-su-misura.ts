import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-wordpress-su-misura',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './wordpress-o-sito-su-misura.html',
})
export class WordpressOSitoSuMisura {}
