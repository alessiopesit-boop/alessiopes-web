import { Directive, ElementRef, afterNextRender, effect, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Palette {
  a1: number[];
  a2: number[];
  node: number;
  link: number;
  mlink: number;
}

/**
 * Rete di particelle reattiva al mouse, sullo sfondo dell'hero.
 * Da applicare a un <canvas> figlio diretto del contenitore .hero.
 * Theme-aware: ricolora al cambio tema. Solo lato browser.
 */
@Directive({
  selector: 'canvas[appParticleNetwork]',
})
export class ParticleNetwork {
  private readonly canvas = inject(ElementRef<HTMLCanvasElement>).nativeElement;
  private readonly themeSvc = inject(ThemeService);

  private ctx!: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private nodes: Node[] = [];
  private raf = 0;
  private ready = false;
  private reduce = false;
  private visible = true;
  private readonly mouse = { x: -9999, y: -9999, active: false };

  private col: Palette = {
    a1: [122, 162, 255],
    a2: [150, 215, 240],
    node: 0.85,
    link: 0.5,
    mlink: 0.65,
  };

  constructor() {
    // ricolora quando cambia il tema
    effect(() => {
      this.themeSvc.theme();
      if (this.ready) this.recolor();
    });

    afterNextRender(() => {
      const ctx = this.canvas.getContext('2d');
      if (!ctx) return;
      this.ctx = ctx;
      this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.recolor();
      this.ready = true;

      const hero = this.canvas.parentElement as HTMLElement;
      // Interazione col puntatore solo con mouse/trackpad: su touch i puntini ondeggiano
      // e basta (niente reattivita' al tocco, che su mobile si nota appena e da' fastidio).
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (finePointer) {
        hero.addEventListener('pointermove', (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          this.mouse.x = e.clientX - r.left;
          this.mouse.y = e.clientY - r.top;
          this.mouse.active = true;
        });
        hero.addEventListener('pointerleave', () => {
          this.mouse.active = false;
          this.mouse.x = -9999;
          this.mouse.y = -9999;
        });
      }

      this.resize();
      this.step();
      window.addEventListener('resize', () => {
        if (this.raf) cancelAnimationFrame(this.raf);
        this.resize();
        this.step();
      });

      // Mette in pausa l'animazione quando l'hero esce dallo schermo (risparmio CPU/batteria).
      const io = new IntersectionObserver((entries) => {
        const vis = entries[0]?.isIntersecting ?? true;
        if (vis === this.visible) return;
        this.visible = vis;
        if (vis && !this.reduce && !this.raf) this.step();
        else if (!vis && this.raf) {
          cancelAnimationFrame(this.raf);
          this.raf = 0;
        }
      });
      io.observe(this.canvas);
    });
  }

  private recolor(): void {
    if (this.themeSvc.theme() === 'light') {
      this.col = { a1: [70, 110, 225], a2: [60, 130, 180], node: 0.5, link: 0.28, mlink: 0.4 };
    } else {
      this.col = { a1: [122, 162, 255], a2: [150, 215, 240], node: 0.85, link: 0.5, mlink: 0.65 };
    }
  }

  private resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const hero = this.canvas.parentElement as HTMLElement;
    this.w = hero.clientWidth;
    this.h = hero.clientHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + 'px';
    this.canvas.style.height = this.h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const count = Math.min(92, Math.floor((this.w * this.h) / 15000));
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.7,
      });
    }
  }

  private step(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    const LINK = 130;
    const a1 = this.col.a1;
    const a2 = this.col.a2;
    const nodes = this.nodes;

    for (let k = 0; k < nodes.length; k++) {
      const n = nodes[k];
      if (this.mouse.active) {
        const mdx = n.x - this.mouse.x;
        const mdy = n.y - this.mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 22500 && md2 > 0.01) {
          const md = Math.sqrt(md2);
          const f = (1 - md / 150) * 0.6;
          n.vx += (mdx / md) * f * 0.18;
          n.vy += (mdy / md) * f * 0.18;
        }
      }
      n.x += n.vx;
      n.y += n.vy;
      n.vx *= 0.992;
      n.vy *= 0.992;
      if (Math.abs(n.vx) < 0.05) n.vx += (Math.random() - 0.5) * 0.04;
      if (Math.abs(n.vy) < 0.05) n.vy += (Math.random() - 0.5) * 0.04;
      if (n.x < 0 || n.x > this.w) n.vx *= -1;
      if (n.y < 0 || n.y > this.h) n.vy *= -1;
      n.x = Math.max(0, Math.min(this.w, n.x));
      n.y = Math.max(0, Math.min(this.h, n.y));
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK) {
          const o = (1 - d / LINK) * this.col.link;
          ctx.strokeStyle = 'rgba(' + a1[0] + ',' + a1[1] + ',' + a1[2] + ',' + o + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (this.mouse.active) {
      for (let m = 0; m < nodes.length; m++) {
        const nn = nodes[m];
        const ddx = nn.x - this.mouse.x;
        const ddy = nn.y - this.mouse.y;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < 190) {
          const oo = (1 - dd / 190) * this.col.mlink;
          ctx.strokeStyle = 'rgba(' + a2[0] + ',' + a2[1] + ',' + a2[2] + ',' + oo + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nn.x, nn.y);
          ctx.lineTo(this.mouse.x, this.mouse.y);
          ctx.stroke();
        }
      }
    }

    for (let p = 0; p < nodes.length; p++) {
      const nd = nodes[p];
      ctx.fillStyle = 'rgba(' + a1[0] + ',' + a1[1] + ',' + a1[2] + ',' + this.col.node + ')';
      ctx.beginPath();
      ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!this.reduce && this.visible) this.raf = requestAnimationFrame(() => this.step());
    else this.raf = 0;
  }
}
