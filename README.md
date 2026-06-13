# alessiopes.it

Sito commerciale personale di Alessio Pes — sviluppatore web e software freelance.

Realizzato in **Angular** (standalone components) con **prerendering statico (SSG)** per un buon SEO, servito come sito statico su GitHub Pages.

## Pagine

- `/` — Home
- `/servizi` — Servizi e prezzi
- `/preventivo` — Configuratore preventivo interattivo
- `/progetti` — Portfolio progetti
- `/chi-sono` — Bio
- `/contatti` — Contatti (WhatsApp + email)
- `/faq` — Domande frequenti
- `/google` — Servizi Google (Ads, LSA, Profilo)
- `/privacy` — Privacy & cookie
- `*` — Pagina non trovata (404)

## Stack

- Angular 22, componenti standalone, routing lazy per pagina
- Prerendering statico: ogni pagina è HTML pronto al build (`outputMode: static`)
- Design system in CSS globale (`src/styles.css`), tema dark/light persistente
- Nessun CMS, nessun backend (storage immagini previsto in futuro)

## Setup locale

```bash
npm install
npm start        # dev server su http://localhost:4200
npm run build    # build di produzione + prerender in dist/alessiopes-web/browser
```

## Deploy

GitHub Pages: https://alessiopesit-boop.github.io/alessiopes-web

Push su `main` → build Angular + deploy automatico. Release (release-please) → ri-deploy.
Il workflow builda con `--base-href=/alessiopes-web/` e copia `index.csr.html` come `404.html`
(fallback per gli URL non prerenderizzati). Con dominio personalizzato, riportare il base-href a `/`.

## Stato

Alpha — design portato in Angular. Contenuti reali, immagini e recapiti (WhatsApp, URL progetti) da inserire.
