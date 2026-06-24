import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleComponent } from '../../../shared/article/article';

@Component({
  selector: 'app-art-quanto-costa',
  imports: [ArticleComponent, RouterLink],
  templateUrl: './quanto-costa-un-sito-web.html',
})
export class QuantoCostaUnSitoWeb {}
