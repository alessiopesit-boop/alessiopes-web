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

- `src/app/app.ts` - shell: `<app-nav>`, `<router-outlet>`, `<app-footer>`, `<app-cookie-banner>`, `<app-page-loader>`
- `src/app/app.routes.ts` - route (le pagine non ancora portate puntano a `ComingSoon` via `data.soon`)
- `src/app/core/` - `ThemeService`, `RevealDirective` (`.reveal` on-scroll)
- `src/app/shared/` - `Nav` (+ hamburger mobile), `Footer`, `CookieBanner`, `PageLoader` (4 quadrati),
  `ParticleNetwork` (direttiva su `canvas[appParticleNetwork]`), `Terminal` (direttiva `[appTerminal]`),
  `ImageSlot` (selettore `image-slot`, placeholder statico, niente drag&drop in questo MVP)
- `src/app/pages/` - `home`, `not-found`, `coming-soon` (le altre pagine arrivano nelle PR successive)

Gli effetti che toccano DOM/`window`/canvas girano solo lato browser (`afterNextRender`), per non rompere il prerender.

## CI/CD

**Push su `main`** - build Angular + deploy automatico su GitHub Pages (`alessiopesit-boop.github.io/alessiopes-web`).
Il workflow `deploy.yml`: `npm ci` -> `npm run build -- --base-href=/alessiopes-web/` ->
copia `index.csr.html` in `404.html` (fallback per URL non prerenderizzati) -> upload di `dist/alessiopes-web/browser`.

**Release pubblicata** (da release-please) - ri-deploy sullo stesso URL.
Quando si compra il dominio: configurare il custom domain in GitHub Pages e riportare `--base-href=/`.

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

## Da fare / segnaposto

- Recapiti reali: numero WhatsApp (`390000000000`) e URL dei progetti online.
- Foto e screenshot dei progetti (oggi placeholder; storage immagini previsto col dominio).
