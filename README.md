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

## Stato

Online (MVP). Recapiti reali (WhatsApp, email sul dominio). Progetti, recensioni e foto restano nascosti finché non ci sono contenuti reali (dettagli in `CLAUDE.md`).
