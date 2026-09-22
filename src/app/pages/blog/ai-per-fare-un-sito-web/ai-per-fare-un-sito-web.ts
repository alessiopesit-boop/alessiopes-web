import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-ai-fare-sito',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './ai-per-fare-un-sito-web.html',
})
export class AiPerFareUnSito {}
