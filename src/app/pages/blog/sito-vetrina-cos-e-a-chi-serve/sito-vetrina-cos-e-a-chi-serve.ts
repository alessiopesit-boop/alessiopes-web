import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-sito-vetrina',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './sito-vetrina-cos-e-a-chi-serve.html',
})
export class SitoVetrinaCosEAChiServe {}
