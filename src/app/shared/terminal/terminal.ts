import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

interface Seq {
  cmd?: string;
  out?: string;
  cls?: string;
  step?: boolean;
}

/**
 * Terminale animato dell'hero: digita comandi e output riga per riga.
 * Da applicare al contenitore .term-body. Solo lato browser.
 * Rispetta prefers-reduced-motion (render statico immediato).
 */
@Directive({
  selector: '[appTerminal]',
})
export class Terminal {
  private readonly el = inject(ElementRef<HTMLElement>).nativeElement;

  private readonly P = 'alessio@studio:~$ ';
  private readonly seq: Seq[] = [
    { cmd: 'nuovo-cliente --tipo "negozio di zona"' },
    { out: 'ok — vediamo di cosa hai bisogno', cls: 'dim' },
    { cmd: './crea-sito --su-misura' },
    { out: 'design ........ ✓ pensato per te', cls: 'ok', step: true },
    { out: 'mobile ........ ✓ perfetto da telefono', cls: 'ok', step: true },
    { out: 'google ........ ✓ ti trovano i clienti', cls: 'ok', step: true },
    { out: 'online ........ ✓ in 1-2 settimane', cls: 'ok', step: true },
    { cmd: 'assistenza --dopo-la-consegna' },
    { out: 'ci sono io · rispondo io · niente call center', cls: 'out' },
    { out: '# dal primo caffè al sito online, sempre io', cls: 'cm' },
  ];

  private i = 0;

  constructor() {
    afterNextRender(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        this.renderAll();
        return;
      }
      setTimeout(() => this.next(), 450);
    });
  }

  private renderAll(): void {
    this.el.innerHTML =
      this.seq
        .map((s) =>
          s.cmd
            ? '<div class="line"><span class="dim">' +
              this.P +
              '</span><span class="out">' +
              s.cmd +
              '</span></div>'
            : '<div class="line ' + s.cls + '">' + s.out + '</div>',
        )
        .join('') +
      '<div class="line"><span class="dim">' +
      this.P +
      '</span><span class="cursor-blk"></span></div>';
  }

  private blinkCursor(node: HTMLElement): void {
    const c = document.createElement('span');
    c.className = 'cursor-blk';
    node.appendChild(c);
    setInterval(() => {
      c.style.opacity = c.style.opacity === '0' ? '1' : '0';
    }, 530);
  }

  private typeInto(node: HTMLElement, text: string, speed: number, done?: () => void): void {
    let k = 0;
    const tk = () => {
      node.textContent = text.slice(0, k);
      if (k++ <= text.length) setTimeout(tk, speed);
      else if (done) done();
    };
    tk();
  }

  private next(): void {
    if (this.i >= this.seq.length) {
      const c = document.createElement('div');
      c.className = 'line';
      c.innerHTML = '<span class="dim">' + this.P + '</span>';
      this.el.appendChild(c);
      this.blinkCursor(c);
      return;
    }
    const s = this.seq[this.i];
    const div = document.createElement('div');
    if (s.cmd) {
      div.className = 'line';
      div.innerHTML =
        '<span class="dim">' +
        this.P +
        '</span><span class="t-cmd out"></span><span class="cursor-blk"></span>';
      this.el.appendChild(div);
      const tgt = div.querySelector('.t-cmd') as HTMLElement;
      const cur = div.querySelector('.cursor-blk') as HTMLElement;
      this.typeInto(tgt, s.cmd, 30, () => {
        cur.remove();
        this.i++;
        setTimeout(() => this.next(), 320);
      });
    } else {
      div.className = 'line ' + (s.cls || 'out');
      this.el.appendChild(div);
      if (s.step)
        this.typeInto(div, s.out!, 6, () => {
          this.i++;
          setTimeout(() => this.next(), 150);
        });
      else
        this.typeInto(div, s.out!, 9, () => {
          this.i++;
          setTimeout(() => this.next(), 240);
        });
    }
    this.el.scrollTop = this.el.scrollHeight;
  }
}
