import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-farsi-trovare-google',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './farsi-trovare-su-google.html',
})
export class FarsiTrovareSuGoogle {}
