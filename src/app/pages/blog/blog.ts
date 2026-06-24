import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { ARTICLES, type Article } from '../../core/blog.data';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, RevealDirective],
  templateUrl: './blog.html',
})
export class Blog {
  readonly articles: Article[] = ARTICLES;
}
