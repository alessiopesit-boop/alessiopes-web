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
- `src/app/app.routes.ts` - route: ogni rotta ha `title` e `data.description` (usati dal `SeoService`).
- `src/app/core/` - `ThemeService`, `SeoService` (meta/OG/canonical per pagina), `RevealDirective` (`.reveal` on-scroll), `PromoService` (promo di lancio)
- `src/app/shared/` - `Nav` (+ hamburger mobile), `Footer`, `CookieBanner`, `PageLoader` (4 quadrati),
  `ParticleNetwork` (direttiva su `canvas[appParticleNetwork]`, in pausa fuori schermo), `Terminal` (direttiva `[appTerminal]`),
  `ImageSlot` (selettore `image-slot`, placeholder statico, niente drag&drop in questo MVP)
- `src/app/pages/` - una cartella per pagina: `home`, `servizi`, `progetti`, `chi-sono`, `preventivo`, `google`, `faq`, `contatti`, `privacy`, `not-found`
- `src/fonts/` - font self-hosted (JetBrains Mono, Space Grotesk; `@font-face` in `styles.css`). Usano `font-display: optional` (non `swap`) per evitare il layout shift / CLS: su rete lenta il font puo' non comparire alla prima visita (poi e' in cache), ma non c'e' mai ricomposizione del testo. Non rimetterli a `swap`.

Gli effetti che toccano DOM/`window`/canvas girano solo lato browser (`afterNextRender`), per non rompere il prerender.

## Logo e icone

Logo "concept B" (terminale, font JetBrains Mono, accento cyan = token `--accent-2`):
- **Compact `>_`**: tile quadrata in `nav` (classe `.logo .mark` + `.gt` per il `>`). È anche la **favicon** (`public/favicon.svg`, tracciati vettoriali, niente dipendenza da font) e le icone PWA/Apple `public/icon-180|192|512.png`.
- **Extended `> alessiopes.it`** animato (cursore lampeggiante): nel **footer** (classi `.logo-term`/`.gt`/`.wm`/`.dot`/`.caret`, keyframe `blink`, disattivato con `prefers-reduced-motion`).
- **Rigenerare i PNG**: `npm i sharp --no-save && node scripts/gen-icons.mjs` (sharp non resta nei deps; i PNG generati vanno committati). Per cambiare il logo, aggiorna sia `favicon.svg` sia l'SVG dentro `scripts/gen-icons.mjs`.
- **Social card** `public/og-image.png` (1200x630): rigenerabile con `npm i @resvg/resvg-js wawoff2 --no-save && node scripts/gen-og.mjs` (decomprime i font `.woff2` del sito in TTF e renderizza l'SVG col brand). Aggiornala se cambi logo o tagline.

## Numeri e indici (convenzione design)

Le famiglie di "numeretti" hanno un senso: contatori di sezione `01` (accent, senza slash), indici card `/01 · …` (con slash, è la vibe "terminale", voluta come elemento che spezza), step/ordinali `01`. Le icone-simbolo delle garanzie (€ ↺ ⌘) restano icone, non numeri.

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

### Monitoraggio uptime

**UptimeRobot** (piano free) controlla che il sito sia online: 2 monitor su `https://alessiopes.it`, ogni 5 minuti, con alert via email.
- **HTTP(s)**: il sito risponde.
- **Keyword** "Alessio Pes": la pagina contiene ancora il testo atteso (becca il caso "risponde 200 ma è rotta/vuota").

Niente status page pubblica (inutile per un sito-vetrina). Config fuori dal repo, sul cruscotto UptimeRobot.

## Comandi locali

```bash
npm install
npm start        # dev server (http://localhost:4200)
npm run build    # build produzione + prerender
npm run audit    # Lighthouse su TUTTE le pagine prerenderizzate (vedi sotto)
```

### Audit Lighthouse (`npm run audit`)

`scripts/audit.mjs` builda la produzione, serve `dist/.../browser` e gira Lighthouse (Chrome/Edge headless, `lighthouse` in devDependencies) su **tutte** le rotte prerenderizzate (le scopre da solo cercando gli `index.html`, quindi resta in sync da sé). Stampa una tabella con i 4 punteggi + LCP/CLS/TBT per pagina.

- **Gate (esce 1)**: solo le categorie **deterministiche** A11y / Best Practices / SEO < 100. Sono riproducibili e indipendenti dalla macchina.
- **Performance**: mostrata ma **informativa**, marker `⚠`. In locale Lighthouse simula CPU 4x + 4G lento e risente del carico della macchina: il valore assoluto **non** è comparabile a PageSpeed Insights (infra Google), che resta l'autorità sulla performance.
- Flag: `--no-build` (salta la build), `--detail` (elenca gli audit falliti per pagina), oppure passa rotte specifiche (`npm run audit -- /preventivo /servizi`).

## SEO

- `SeoService` (`core/seo.service.ts`) imposta `description`, Open Graph, Twitter e `canonical` per pagina; la description di ogni pagina sta in `data.description` della rotta.
- Tag fissi (og:image, og:site_name, JSON-LD `ProfessionalService`) in `index.html`. `robots.txt`, `sitemap.xml` e `og-image.png` (1200x630) in `public/`.
- **Dominio cablato**: l'origine `https://alessiopes.it` è hardcoded in `seo.service.ts`, `index.html`, `sitemap.xml`, `robots.txt`. Se cambia il dominio, aggiornarli.
- **Slash finale = forma canonica**: GitHub Pages serve ogni rotta come directory (`/privacy` -> `/privacy/index.html`) e fa un **301 verso lo slash finale**. Perciò `canonical`, `og:url` (`seo.service.ts`), le `<loc>` in `sitemap.xml` e le URL interne nel JSON-LD (breadcrumb, author) devono avere lo **slash finale** (tranne la root `/`), così combaciano con la URL che risponde 200 ed evitano il report "Pagina con reindirizzamento" in Search Console.

### Analytics

- **Cloudflare Web Analytics** (cookieless, niente profilazione): beacon `static.cloudflareinsights.com/beacon.min.js` con `data-cf-beacon` token, in fondo al `<body>` di `index.html`. Modalità JS-beacon (nessun proxy/cambio DNS: il sito resta su GitHub Pages). I dati compaiono nella dashboard Cloudflare solo dopo che la versione col beacon è online.
- Essendo senza cookie e senza profilazione, non è dietro consenso: è solo **dichiarato** nella pagina `/privacy` (sezione 3) e accennato nel `CookieBanner`. Se in futuro aggiungi strumenti con cookie/profilazione (es. Google Analytics, pixel), allora servirà il gating dietro consenso.

### Regole per ogni nuova pagina/contenuto (blog/guide compresi)

Da rispettare sempre, per non rovinare la SEO e l'accessibilità:

1. **Una sola `<h1>` per pagina**, poi heading **senza salti** (`h1` -> `h2` -> `h3`, mai `h2` -> `h4`). Lighthouse penalizza i salti.
2. **`title` e `data.description` univoci** su ogni rotta (`app.routes.ts`): li legge il `SeoService`. Title ~50-60 caratteri, description ~150-160, con le parole che la gente cerca davvero (una keyword principale per pagina).
3. **Aggiungi la nuova rotta a `public/sitemap.xml`** (e, se serve, a `robots.txt`).
4. **Link interni** tra pagine correlate, con testo descrittivo (no "clicca qui").
5. **Immagini**: `alt` sensato, formato **WebP**, **dimensioni esplicite** (`width`/`height` anti-CLS), `loading="lazy"` sotto la piega.
6. **Contrasto testo >= 4.5:1** (i token `--text`/`--muted` ok; `--faint` è già al limite, non scendere oltre).
6b. **Leggibilità**: niente testo sotto **12.5px** (pavimento dei label mono in `styles.css`). Sotto i 12px Lighthouse mobile segnala "font troppo piccolo"; restano sotto solo i glifi decorativi (es. il `◆` del ticker), non il testo.
7. **Per gli articoli blog**: URL pulito (`/blog/<slug>`), JSON-LD `Article`+`Breadcrumb`(+`FAQPage`), `canonical` corretto. Contenuto che risponde a una ricerca reale, non keyword stuffing.

## Blog / Guide

**Scopo**: ogni articolo/guida serve a fare **SEO e portare traffico organico** verso i servizi. Strategia: **evergreen ad alta intenzione** (cosa cercano davvero le piccole attività: "quanto costa un sito", "WordPress o su misura", "sito o pagina Facebook", "farsi trovare su Google"), **non** contenuti trending/news (traffico che non converte e decade). L'**anno nel titolo** (es. "...nel 2026") si usa **solo** dove l'anno conta davvero (guide-prezzo) ed è un **refresh manuale annuale** (aggiorni numeri + `dateModified`), mai automatico (su SSG sarebbe congelato o ingannevole). Ogni articolo deve avere **link interni** alle pagine che convertono (`/preventivo`, `/servizi`, `/google`).

**Come funziona**:
- Registro unico in `core/blog.data.ts` (`ARTICLES`): slug, title, h1, dek, description, categoria, date, FAQ, ecc. Alimenta indice, rotte, "correlate", JSON-LD e sitemap.
- `shared/article/` (`<app-article slug="...">`): layout condiviso (header, **indice/TOC auto**, **tempo di lettura** e **barra di lettura** lato browser, box autore, correlate, CTA). Ogni articolo proietta dentro la `.prose` **solo i blocchi che gli servono** (vedi [[blog-template]]): `lead`, `takeaways`, `callout tip|warn|note`, `art-table`, `pullquote`, `art-steps`, `inline-cta`, `faq art-faq`. Stili in `styles.css` (sezione BLOG / GUIDE). I numeri delle sezioni (`h2 > .num`) seguono la convenzione home (vedi "Numeri e indici"): su mobile grandi quanto il titolo, sulla prima riga. Su mobile l'indice "In questa guida" diventa un box in cima e tra le sezioni compaiono separatori hairline come nel resto del sito.
- SEO articolo: il `SeoService` legge `data.article` dalla rotta e genera og:type=article, `article:*` e il JSON-LD `Article`+`BreadcrumbList`(+`FAQPage`). Le FAQ visibili devono combaciare 1:1 con quelle nel registro.

**Prezzi negli articoli**: gli articoli **non** citano il listino personale esatto (890€, 1.290€, ecc.) e **mai** la promo di lancio. Usano **fasce arrotondate / ordini di grandezza** (es. "da circa 1.000€") robusti ai ritocchi, e rimandano a `/servizi` (listino, fonte unica) e `/preventivo` (stima live). Così un cambio di listino **non tocca mai il blog**. I costi generici e stabili (es. dominio+hosting ~90€/anno, budget Ads ~10-15€/giorno) possono restare come numeri.

**Aggiungere un articolo**: 1) voce in `ARTICLES`; 2) componente in `pages/blog/<slug>/` con `<app-article slug="...">` e la prose; 3) rotta in `app.routes.ts` (`data: { description, article }`); 4) URL in `public/sitemap.xml`.

## Posizionamento e tono (copy)

Deciso il 2026-07-14. Il sito serve **due imbuti**: il micro-locale arriva via SEO/SEM, il cliente strutturato (cinema, e-commerce PMI) arriva via **outreach** e giudica home/servizi/chi-sono come prova di credibilità. Il copy non deve mettere un **soffitto** che spaventi i clienti grossi.

- **Target**: "attività e aziende", non "piccole attività / P.IVA" (che restava cablato in hero, footer, description SEO, JSON-LD, `seo.service.ts` `DEFAULT_DESC`, bio autore blog).
- **Vendi il beneficio, non la tecnica**: "niente WordPress" resta ma come vantaggio (veloce, sicuro, tuo). Arma differenziante da tenere in evidenza: sviluppo full-stack + **infrastruttura** (server, deploy) + **integrazione col gestionale/CRM** del cliente (card "Cresce con te" in `servizi.html`).
- **Prezzo sul valore**, non "costo meno di un'agenzia": tolta l'ancora "22% in meno di un'agenzia". La trasparenza (forfettario, prezzo bloccato) resta.
- **Paletti di onestà (MAI violare)**: niente statistiche inventate ("converte il doppio", "+50% utenti"), niente "100/100 PageSpeed" come promessa (la performance non è garantita, vedi `npm run audit`), niente "impossibile da hackerare" (i prodotti dinamici hanno DB/server veri), niente "hosting gratis" (il server lo gestisci e lo fatturi nel canone), niente strumenti che non usi (Strapi/Sanity/CMS headless). Si alza il tetto con **competenza reale + demo**, non gonfiando un curriculum (è davvero all'inizio, 1 cliente).
- **Eccezione blog**: resta tarato su "piccola attività" di proposito (intento di ricerca SEO locale). Non allargarlo.

## Prezzi e promo di lancio

- **Listino pieno** (5 soluzioni): vetrina da 1.290€, sito+portale da 2.400€, e-commerce da 2.900€ (headless, sul gestionale del cliente) / da 3.900€ (su misura completo), software/gestionale web da 4.900€, app mobile da 6.900€. L'e-commerce headless e su misura completo convivono nella stessa card `/03` (headline "da 2.900€"); la distinzione è nel copy e nelle cost-lines. I prezzi delle soluzioni vivono in tre punti: `pages/servizi/servizi.html` (listino), `pages/home/home.html` (card teaser) e `pages/preventivo/preventivo.ts` (`types`). Se cambi un prezzo, allineali tutti e tre. NB: la home teaser resta a **4 card** (griglia a 4 colonne): la card /04 "App e software" copre sia software che app mobile e mostra il floor da 3.900€ (link a `#software`); lo sdoppio software vs app mobile è solo nel listino `servizi` (`#software` e `#app`) e nel configuratore.
- **Prezzi Google** (Profilo, Ads, LSA): vivono in `servizi.html` (mkt-grid), `pages/google/google.html` (listino esteso) e `preventivo.ts` (`googleOpts`) - **4° punto da allineare**. Attuali: Profilo Google 150€ creazione una tantum + da 99€/mese gestione facoltativa; Google Ads 250€ setup + 350€/mese; Local Services Ads 200€ setup + 300€/mese (il budget pubblicitario è sempre a parte, a carico del cliente, direttamente a Google).
- **Promo di lancio** (`core/promo.service.ts`): vetrina a 890€ invece di 1.290€ + 6 mesi di manutenzione anziché 3. Governata da una sola data `END_DATE`: oltre quella, badge, prezzo barrato, box "Perché questo prezzo" e countdown spariscono da soli e i prezzi tornano pieni ovunque (servizi, home, preventivo). Per chiudere/spostare la promo basta cambiare `END_DATE`. Il countdown ("ancora N giorni") è calcolato **solo lato browser** (`afterNextRender`) per non congelarsi alla build (SSG).
- **Alla scadenza non serve una PR**: la promo sparisce da sola. Resta solo del **dead code** da ripulire con comodo (non si vede): i rami `@if (promo.active()) {…} @else {…}` in `servizi.html`/`home.html`, `pxOf()`/`effectiveBase` in `preventivo.ts` e l'intero `PromoService`. Quando decidi che non torna, togli i rami `@else` (tieni i prezzi pieni), il `PromoService` e questa sezione.
- **Footer legale**: P.IVA `18625461001` attiva dal 01/07/2026 (regime forfettario, art. 1 c. 54 L. 190/2014). In `shared/footer/footer.html` sono mostrati il numero e la dicitura forfettaria (compenso non soggetto a IVA né a ritenuta d'acconto). La FAQ "Devo pagare l'IVA?" (`faq/faq.html`, gruppo 01) spiega al cliente che la fattura è senza IVA. I prezzi del listino sono già IVA esclusa/non applicata (coerente col forfettario).

## Da fare / segnaposto

- WhatsApp: numero reale (`393897979420`). Email: `ciao@alessiopes.it` attiva e usata ovunque nel sito (alias Tophost con risposta/send-as dalla Gmail di Alessio).
- Foto: nascosta per l'MVP (vedi sotto). Quando arriva una foto vera, riattivare lo slot in `home.html` e `chi-sono.html` (la griglia torna a 2 colonne da sola via `:has`).
- **Progetti**: ATTIVI. Pagina `/progetti` + sezione home "Lavori recenti" + voce nav/footer mostrano 3 progetti reali: il primo **sito cliente** (General Services 2013, sito vetrina per un termoidraulico, `generalservices2013.it`, in prima posizione con label "· cliente") più 2 demo personali (Suea Fai/krating-daeng e Guess the Char). Screenshot WebP in `public/projects/` (catturati dai siti live con Edge headless, convertiti con sharp). Per aggiungerne altri: una card in `progetti.html` (e, se vuoi, in `home.html`) + immagine in `public/projects/`.
- **Recensioni**: sezione "Dicono di me" (`home.html`, `@if (true)`) ATTIVA con recensioni **vere** da **Trustpilot** (non più Google/finte). Hardcoded (niente widget/API di terze parti: si romperebbe il cookieless e peserebbe sul LCP), mostrate verbatim + badge "verificata su Trustpilot" con link al profilo (`it.trustpilot.com/review/alessiopes.it`). Con 1 recensione la griglia usa `.reviews-grid.single` (card centrata). Per aggiungerne: una nuova `.review` nella griglia (togliere `single` quando sono ≥2).
- **Guess the Char su Play Store**: in test di produzione (richiesto 2026-06-24), non ancora pubblicata. Quando è live sullo store, aggiungere un badge/link "Google Play" alla sua card in `progetti.html` (e `home.html`) e aggiornare il tipo (oggi "Web app · PWA"). Finché non è live, niente link allo store (eviterebbe link morti).
