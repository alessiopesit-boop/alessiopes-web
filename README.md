# alessiopes.it

Sito commerciale personale di Alessio Pes, sviluppatore web e software freelance.

Online su **[alessiopes.it](https://alessiopes.it)**. Realizzato in **Angular** (standalone components) con **prerendering statico (SSG)** per un buon SEO, servito come sito statico su GitHub Pages con dominio personalizzato.

## Pagine

- `/` - Home
- `/servizi` - Servizi e prezzi
- `/preventivo` - Configuratore preventivo interattivo
- `/progetti` - Portfolio progetti *(nascosto per l'MVP, in arrivo)*
- `/chi-sono` - Bio
- `/contatti` - Contatti (WhatsApp + email)
- `/faq` - Domande frequenti
- `/google` - Servizi Google (Ads, LSA, Profilo)
- `/privacy` - Privacy & cookie
- `*` - Pagina non trovata (404)

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

Online su **[alessiopes.it](https://alessiopes.it)** (GitHub Pages + custom domain, HTTPS via Let's Encrypt).

La **produzione si aggiorna solo a un rilascio** (release-please): i push su `main` servono per integrazione e test in locale, non fanno deploy. Il workflow builda con `--base-href=/` e copia `index.csr.html` come `404.html` (fallback per gli URL non prerenderizzati).

## SEO e accessibilità

La parte tecnica è già pronta (sito statico veloce, meta per pagina, Open Graph, sitemap, robots, JSON-LD). Per **non rovinarla** quando si aggiungono pagine o contenuti (blog/guide), valgono alcune regole fisse:

- una sola `<h1>` per pagina e heading **senza salti** (`h1` -> `h2` -> `h3`);
- `title` e meta `description` univoci per ogni rotta (una keyword principale a pagina);
- ogni nuova rotta va aggiunta a `public/sitemap.xml`;
- immagini in WebP con dimensioni esplicite (anti-CLS), `alt` e `loading="lazy"`;
- testo con contrasto AA (>= 4.5:1).

Checklist completa e dettagli per gli articoli blog in `CLAUDE.md`.

## Stato

Online (MVP). Recapiti reali (WhatsApp, email sul dominio). Progetti, recensioni e foto restano nascosti finché non ci sono contenuti reali (dettagli in `CLAUDE.md`).
