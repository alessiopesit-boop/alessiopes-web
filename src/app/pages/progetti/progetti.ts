import { Component, afterNextRender, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

type View = 'grid' | 'list';
const STORAGE_KEY = 'ap-proj-view';

@Component({
  selector: 'app-progetti',
  imports: [RouterLink, RevealDirective],
  templateUrl: './progetti.html',
})
export class Progetti {
  readonly view = signal<View>('grid');

  constructor() {
    afterNextRender(() => {
      let saved: View = 'grid';
      try {
        saved = (localStorage.getItem(STORAGE_KEY) as View) || 'grid';
      } catch {
        /* ignore */
      }
      if (saved === 'list') this.view.set('list');
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
