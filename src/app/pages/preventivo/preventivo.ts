import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { PromoService } from '../../core/promo.service';

// Recapiti reali usati per i link WhatsApp/email del configuratore.
const WHATSAPP = '393897979420'; // numero WhatsApp (prefisso internazionale, senza +)
const EMAIL = 'ciao@alessiopes.it';

type TypeVal = 'vetrina' | 'gestione' | 'ecommerce' | 'software' | 'app';

interface TypeOpt {
  val: TypeVal;
  base: number;
  label: string;
  short: string;
  px: string;
}
interface AddonOpt {
  val: string;
  price: number;
  short: string;
  px: string;
}
interface GoogleOpt {
  setup: number;
  mo: number;
  label: string;
  short: string;
  px: string;
  budget?: string;
}
interface MaintOpt {
  maint: boolean;
  label: string;
  short: string;
}
interface SimpleOpt {
  label: string;
  short: string;
}

const recurringAnnual: Record<TypeVal, number> = { vetrina: 90, gestione: 180, ecommerce: 240, software: 240, app: 240 };
const maintMonthly: Record<TypeVal, number> = { vetrina: 15, gestione: 39, ecommerce: 49, software: 79, app: 99 };
const typeAnnualLabel: Record<TypeVal, string> = {
  vetrina: 'dominio + hosting',
  gestione: 'server + hosting',
  ecommerce: 'server + hosting',
  software: 'server + servizi',
  app: 'server + servizi',
};

@Component({
  selector: 'app-preventivo',
  imports: [RevealDirective],
  templateUrl: './preventivo.html',
})
export class Preventivo {
  readonly types: TypeOpt[] = [
    { val: 'vetrina', base: 890, label: 'Sito vetrina', short: 'Sito vetrina', px: 'da 890€' },
    { val: 'gestione', base: 2400, label: 'Sito + portale di gestione', short: 'Sito + gestione', px: 'da 2.400€' },
    { val: 'ecommerce', base: 3900, label: 'E-commerce su misura', short: 'E-commerce', px: 'da 3.900€' },
    { val: 'software', base: 3900, label: 'Software o gestionale su misura', short: 'Software / gestionale', px: 'da 3.900€' },
    { val: 'app', base: 6900, label: 'App mobile su misura', short: 'App mobile', px: 'da 6.900€' },
  ];
  readonly addons: AddonOpt[] = [
    { val: 'Prenotazioni online', price: 400, short: 'Prenotazioni online', px: '+400€' },
    { val: 'Area riservata / login', price: 500, short: 'Area riservata', px: '+500€' },
    { val: 'Blog / news gestibili', price: 250, short: 'Blog / news', px: '+250€' },
    { val: 'Newsletter / raccolta contatti', price: 200, short: 'Newsletter', px: '+200€' },
    { val: 'Galleria foto avanzata', price: 150, short: 'Galleria foto', px: '+150€' },
    { val: 'Chat WhatsApp integrata', price: 120, short: 'Chat WhatsApp', px: '+120€' },
    { val: 'Sito multilingua', price: 300, short: 'Multilingua', px: '+300€' },
  ];
  readonly googleOpts: GoogleOpt[] = [
    { setup: 0, mo: 0, label: 'No, per ora solo il sito', short: 'No, per ora', px: '' },
    { setup: 150, mo: 99, label: 'Profilo Google + Maps', short: 'Profilo Google', px: '+150€ · da 99€/mese' },
    {
      setup: 250,
      mo: 350,
      label: 'Google Ads',
      short: 'Google Ads',
      px: '+250€ · 350€/mese',
      budget: '~300-500€/mese a Google (≈10-15€/giorno), lo decidi tu',
    },
    {
      setup: 200,
      mo: 300,
      label: 'Local Services Ads',
      short: 'Local Services Ads',
      px: '+200€ · 300€/mese',
      budget: 'paghi per contatto ~15-30€ (molti con tetto ~300€/mese)',
    },
  ];
  readonly maintOpts: MaintOpt[] = [
    { maint: false, label: 'No, interventi a pacchetto', short: 'No, a pacchetto' },
    { maint: true, label: 'Sì, canone mensile', short: 'Sì, canone mensile' },
  ];
  readonly startOpts: SimpleOpt[] = [
    { label: 'Parto da zero', short: 'Parto da zero' },
    { label: 'Ho già un sito da rifare', short: 'Ho già un sito da rifare' },
    { label: 'Ho già dominio e hosting', short: 'Ho già dominio/hosting' },
  ];
  readonly whenOpts: SimpleOpt[] = [
    { label: 'Il prima possibile', short: 'Il prima possibile' },
    { label: 'Entro 1-2 mesi', short: 'Entro 1-2 mesi' },
    { label: 'Sto solo valutando', short: 'Sto solo valutando' },
  ];

  readonly promo = inject(PromoService);
  private readonly route = inject(ActivatedRoute);
  // Prezzo pieno del sito vetrina fuori promo (la base nei `types` e' quella di lancio).
  private static readonly VETRINA_FULL = 1290;

  constructor() {
    // Preseleziona il pacchetto se arrivo da /servizi con ?tipo=... (solo lato browser, no mismatch SSG).
    afterNextRender(() => {
      const tipo = this.route.snapshot.queryParamMap.get('tipo');
      const i = this.types.findIndex((t) => t.val === tipo);
      if (i >= 0) this.typeIdx.set(i);
    });
  }

  // selezioni
  readonly typeIdx = signal(0);
  readonly pages = signal(5);
  readonly addonSel = signal<ReadonlySet<number>>(new Set());
  readonly googleIdx = signal(0);
  readonly maintIdx = signal(1); // default: canone
  readonly startIdx = signal(0);
  readonly whenIdx = signal(0);
  readonly note = signal('');

  // derivati
  readonly type = computed(() => this.types[this.typeIdx()]);
  readonly isVetrina = computed(() => this.type().val === 'vetrina');
  // Base effettiva: il vetrina usa il prezzo di lancio finche' la promo e' attiva, poi quello pieno.
  private readonly effectiveBase = computed(() =>
    this.isVetrina() && !this.promo.active() ? Preventivo.VETRINA_FULL : this.type().base,
  );
  // Etichetta prezzo per i bottoni: il vetrina segue la promo.
  pxOf(t: TypeOpt): string {
    if (t.val === 'vetrina' && !this.promo.active()) return 'da ' + this.fmt(Preventivo.VETRINA_FULL) + '€';
    return t.px;
  }
  readonly pagesLabel = computed(() => {
    const n = this.pages();
    return n + (n === 1 ? ' pagina' : ' pagine');
  });
  private readonly pageExtra = computed(() =>
    this.isVetrina() ? Math.max(0, this.pages() - 5) * 90 : 0,
  );
  private readonly addonTotal = computed(() =>
    [...this.addonSel()].reduce((sum, i) => sum + this.addons[i].price, 0),
  );
  private readonly google = computed(() => this.googleOpts[this.googleIdx()]);
  private readonly wantMaint = computed(() => this.maintOpts[this.maintIdx()].maint);

  readonly oneTime = computed(() =>
    this.round10(this.effectiveBase() + this.pageExtra() + this.addonTotal() + this.google().setup),
  );
  private readonly annual = computed(() => recurringAnnual[this.type().val]);
  private readonly monthly = computed(
    () => (this.wantMaint() ? maintMonthly[this.type().val] : 0) + this.google().mo,
  );

  readonly recap = computed<[string, string][]>(() => {
    const t = this.type();
    const rows: [string, string][] = [];
    rows.push(['Soluzione', t.label]);
    if (this.isVetrina())
      rows.push(['Pagine', this.pages() + (this.pageExtra() ? ' (+' + this.fmt(this.pageExtra()) + '€)' : '')]);
    const addonLabels = [...this.addonSel()].map((i) => this.addons[i].val);
    rows.push(['Funzioni extra', addonLabels.length ? addonLabels.join(', ') : 'nessuna']);
    rows.push(['Google', this.google().label]);
    const m = this.maintOpts[this.maintIdx()];
    rows.push(['Manutenzione', this.wantMaint() ? m.label + ' (' + maintMonthly[t.val] + '€/mese)' : m.label]);
    rows.push(['Da dove', this.startOpts[this.startIdx()].label]);
    rows.push(['Quando', this.whenOpts[this.whenIdx()].label]);
    return rows;
  });

  readonly recurringHtml = computed(() => {
    const t = this.type().val;
    const prefix = this.isVetrina() ? '~' : 'da ~';
    const suffix = this.isVetrina() ? '' : ' · varia col traffico';
    const parts: string[] = [];
    parts.push(
      'Dal 2° anno: <b>' + prefix + this.fmt(this.annual()) + '€/anno</b> di ' + typeAnnualLabel[t] + suffix + ' (li gestisco io).',
    );
    const monthly = this.monthly();
    const gMo = this.google().mo;
    if (monthly > 0)
      parts.push(
        'Mensile: <b>~' +
          this.fmt(monthly) +
          '€/mese</b>' +
          (gMo
            ? ' (gestione Google ' +
              this.fmt(gMo) +
              '€' +
              (this.wantMaint() ? ' + manutenzione ' + maintMonthly[t] + '€' : '') +
              ')'
            : '') +
          '.',
      );
    const budget = this.google().budget;
    if (budget) parts.push('Budget pubblicitario (a carico tuo, a Google): <b>' + budget + '</b>.');
    return parts.join('<br>');
  });

  private readonly message = computed(() => {
    const lines: string[] = [];
    lines.push('Ciao Alessio! Ho usato il configuratore sul sito:');
    lines.push('');
    this.recap().forEach((r) => lines.push('• ' + r[0] + ': ' + r[1]));
    lines.push('');
    lines.push('Stima una tantum: ~' + this.fmt(this.oneTime()) + '€');
    const prefix = this.isVetrina() ? '~' : 'da ~';
    lines.push(
      'Annuo: ' + prefix + this.fmt(this.annual()) + '€' + (this.monthly() ? ' · Mensile: ~' + this.fmt(this.monthly()) + '€' : ''),
    );
    const budget = this.google().budget;
    if (budget) lines.push('Budget pubblicità (a Google, a parte): ' + budget);
    const note = this.note().trim();
    if (note) {
      lines.push('');
      lines.push('Note: ' + note);
    }
    lines.push('');
    lines.push('Vorrei un preventivo preciso. Grazie!');
    return lines.join('\n');
  });

  readonly waHref = computed(() => 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(this.message()));
  readonly mailHref = computed(
    () =>
      'mailto:' +
      EMAIL +
      '?subject=' +
      encodeURIComponent('Richiesta preventivo dal sito') +
      '&body=' +
      encodeURIComponent(this.message()),
  );

  readonly totalText = computed(() => this.fmt(this.oneTime()));
  readonly noteLeft = computed(() => 500 - this.note().length);

  // azioni
  selectType(i: number): void {
    this.typeIdx.set(i);
  }
  toggleAddon(i: number): void {
    const next = new Set(this.addonSel());
    if (next.has(i)) next.delete(i);
    else next.add(i);
    this.addonSel.set(next);
  }
  isAddonOn(i: number): boolean {
    return this.addonSel().has(i);
  }
  onPages(e: Event): void {
    this.pages.set(parseInt((e.target as HTMLInputElement).value, 10));
  }
  onNote(e: Event): void {
    this.note.set((e.target as HTMLTextAreaElement).value);
  }
  // Azzera il configuratore e riporta tutte le scelte ai valori di partenza.
  reset(): void {
    this.typeIdx.set(0);
    this.pages.set(5);
    this.addonSel.set(new Set());
    this.googleIdx.set(0);
    this.maintIdx.set(1);
    this.startIdx.set(0);
    this.whenIdx.set(0);
    this.note.set('');
  }

  private fmt(n: number): string {
    return n.toLocaleString('it-IT');
  }
  private round10(n: number): number {
    return Math.round(n / 10) * 10;
  }
}
