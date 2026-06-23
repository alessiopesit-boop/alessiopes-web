# alessiopes-web

Sito personale di Alessio Pes (servizi web per PMI/P.IVA) realizzato in **Angular** con
**prerendering statico (SSG)**. Nessun CMS, nessun backend.

## Stack

- Angular 22, componenti standalone, routing con `loadComponent` (un chunk per pagina)
- Prerendering statico: `angular.json` -> `outputMode: "static"`, build in `dist/alessiopes-web/browser`
- Design system in CSS globale: `src/styles.css` (token, temi dark/light, tutte le classi del design)
- Tema dark default + toggle light persistente (`ThemeService`, `localStorage` chiave `ap-theme`)
- Deploy: GitHub Pages via GitHub Actions
- Versioning: release-please (tipo `node`, legge `package.json`)
- Branch principale: `main`

## Struttura

- `src/app/app.ts` / `app.html` - shell: `<app-nav>`, `<router-outlet>`, `<app-footer>`, `<app-cookie-banner>`, `<app-page-loader>` + il FAB WhatsApp (solo mobile)
- `src/app/app.routes.ts` - route: ogni rotta ha `title` e `data.description` (usati dal `SeoService`). `/progetti` e' commentata per l'MVP.
- `src/app/core/` - `ThemeService`, `SeoService` (meta/OG/canonical per pagina), `RevealDirective` (`.reveal` on-scroll), `PromoService` (promo di lancio)
- `src/app/shared/` - `Nav` (+ hamburger mobile), `Footer`, `CookieBanner`, `PageLoader` (4 quadrati),
  `ParticleNetwork` (direttiva su `canvas[appParticleNetwork]`, in pausa fuori schermo), `Terminal` (direttiva `[appTerminal]`),
  `ImageSlot` (selettore `image-slot`, placeholder statico, niente drag&drop in questo MVP)
- `src/app/pages/` - una cartella per pagina: `home`, `servizi`, `progetti`, `chi-sono`, `preventivo`, `google`, `faq`, `contatti`, `privacy`, `not-found`
- `src/fonts/` - font self-hosted (JetBrains Mono, Space Grotesk; `@font-face` in `styles.css`)

Gli effetti che toccano DOM/`window`/canvas girano solo lato browser (`afterNextRender`), per non rompere il prerender.

## CI/CD

Niente ambiente di staging: si testa **in locale** (`npm start`). La **produzione** (`alessiopes.it`) si aggiorna **solo a un rilascio**.

**Push su `main`** - nessun deploy (solo integrazione + test locale).

**Release pubblicata** (da release-please) - build + deploy su GitHub Pages (custom domain `alessiopes.it`). C'è anche `workflow_dispatch` per un deploy manuale d'emergenza.
Il workflow `deploy.yml`: `npm ci` -> `npm run build -- --base-href=/` -> copia `index.csr.html` in `404.html` -> `.nojekyll` -> upload di `dist/alessiopes-web/browser`. Il custom domain + HTTPS sono impostati in *Settings > Pages*; `public/CNAME` contiene `alessiopes.it`.

### Dominio ed email (acquisto)

Dominio `alessiopes.it` registrato su **Tophost**, pacchetto *Topname* (rinnovo **~6€/anno**). Include: dominio `.it`, 1GB di hosting (non usato: il sito sta su GitHub Pages) e **1 casella email** (`ciao@alessiopes.it`).

### Secrets GitHub da configurare

| Secret | Descrizione |
|--------|-------------|
| `RELEASE_PLEASE_TOKEN` | Fine-grained PAT con permessi Contents + Pull requests (write) sul repo |

### Setup una-tantum

1. Settings > Branches > Default branch: `main`
2. Settings > Pages > Source: **GitHub Actions**
3. Aggiungere il secret `RELEASE_PLEASE_TOKEN`

## Comandi locali

```bash
npm install
npm start        # dev server (http://localhost:4200)
npm run build    # build produzione + prerender
```

## SEO

- `SeoService` (`core/seo.service.ts`) imposta `description`, Open Graph, Twitter e `canonical` per pagina; la description di ogni pagina sta in `data.description` della rotta.
- Tag fissi (og:image, og:site_name, JSON-LD `ProfessionalService`) in `index.html`. `robots.txt`, `sitemap.xml` e `og-image.png` (1200x630) in `public/`.
- **Dominio cablato**: l'origine `https://alessiopes.it` è hardcoded in `seo.service.ts`, `index.html`, `sitemap.xml`, `robots.txt`. Se cambia il dominio, aggiornarli.

### Regole per ogni nuova pagina/contenuto (blog/guide compresi)

Da rispettare sempre, per non rovinare la SEO e l'accessibilità:

1. **Una sola `<h1>` per pagina**, poi heading **senza salti** (`h1` -> `h2` -> `h3`, mai `h2` -> `h4`). Lighthouse penalizza i salti.
2. **`title` e `data.description` univoci** su ogni rotta (`app.routes.ts`): li legge il `SeoService`. Title ~50-60 caratteri, description ~150-160, con le parole che la gente cerca davvero (una keyword principale per pagina).
3. **Aggiungi la nuova rotta a `public/sitemap.xml`** (e, se serve, a `robots.txt`).
4. **Link interni** tra pagine correlate, con testo descrittivo (no "clicca qui").
5. **Immagini**: `alt` sensato, formato **WebP**, **dimensioni esplicite** (`width`/`height` anti-CLS), `loading="lazy"` sotto la piega.
6. **Contrasto testo >= 4.5:1** (i token `--text`/`--muted` ok; `--faint` è già al limite, non scendere oltre).
7. **Per gli articoli blog**: URL pulito (`/blog/<slug>`), JSON-LD `BlogPosting` (data, autore), `canonical` corretto. Contenuto che risponde a una ricerca reale, non keyword stuffing.

## Prezzi e promo di lancio

- **Listino pieno**: vetrina 890€, sito+portale da 1.900€, e-commerce da 3.200€, app/software da 3.900€. I prezzi vivono in tre punti: `pages/servizi/servizi.html` (listino), `pages/home/home.html` (card teaser) e `pages/preventivo/preventivo.ts` (`types`). Se cambi un prezzo, allineali tutti e tre.
- **Promo di lancio** (`core/promo.service.ts`): per i primi clienti il sito vetrina è a 590€ invece di 890€. La promo è governata da una sola data `END_DATE`: oltre quella, badge, prezzo barrato, box "Perché questo prezzo" e countdown spariscono da soli e i prezzi tornano pieni (vetrina 890€) ovunque (servizi, home, preventivo). Per chiudere o spostare la promo basta cambiare `END_DATE`.
- Il countdown ("ancora N giorni") è calcolato **solo lato browser** (`afterNextRender`), così non resta congelato al momento della build (SSG). La promo include 6 mesi di manutenzione anziché 3.
- **Niente PR per chiudere la promo**: alla scadenza sparisce da sola. Resta solo del **dead code** da ripulire con comodo (nessuna fretta, non si vede): i blocchi `@if (promo.active()) { ... } @else { ... }` in `servizi.html`/`home.html`, `pxOf()`/`effectiveBase` in `preventivo.ts` e l'intero `PromoService`. Quando decidi che la promo non torna, togli i rami `@else` (tieni i prezzi pieni), il `PromoService` e questa sezione.
- **Footer legale**: `P.IVA in apertura`. In `shared/footer/footer.html` c'è la dicitura del regime forfettario pronta (commentata): quando la P.IVA è attiva, inserire il numero e mostrare la riga. **Formula da confermare col commercialista.**

## Da fare / segnaposto

- WhatsApp: numero reale impostato (`393897979420`). Email: per l'MVP si usa la personale (`alessio.pes.it@gmail.com`), da spostare su `ciao@alessiopes.it` quando il dominio ha la casella.
- Foto: nascosta per l'MVP (vedi sotto). Quando arriva una foto vera, riattivare lo slot in `home.html` e `chi-sono.html` (la griglia torna a 2 colonne da sola via `:has`).
- Screenshot dei progetti (oggi placeholder; storage immagini previsto col dominio).
- **Progetti e recensioni nascosti per l'MVP** (non ancora reali): sezioni home "Lavori recenti"/"Dicono di me", voce nav/footer e rotta `/progetti` sono dietro `@if (false)` o commentate. Per ripristinare basta togliere il "nascondi" (`@if (false)` -> `@if (true)` e scommentare la rotta in `app.routes.ts`).
