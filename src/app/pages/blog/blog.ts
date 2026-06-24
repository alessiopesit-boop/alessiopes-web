import { Component, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { ARTICLES, type Article } from '../../core/blog.data';

type View = 'grid' | 'list';
const STORAGE_KEY = 'ap-blog-view';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, RevealDirective],
  templateUrl: './blog.html',
})
export class Blog {
  readonly articles: Article[] = ARTICLES;
  readonly view = signal<View>('grid');

  constructor() {
    afterNextRender(() => {
      try {
        if ((localStorage.getItem(STORAGE_KEY) as View) === 'list') this.view.set('list');
      } catch {
        /* ignore */
      }
    });
  }

  setView(v: View): void {
    this.view.set(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  }
}
