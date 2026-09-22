import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-quando-rifare-sito',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './quando-rifare-il-sito-web.html',
})
export class QuandoRifareIlSito {}
