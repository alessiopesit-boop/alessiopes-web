# alessiopes-web

Sito commerciale di Alessio Pes — sviluppatore freelance per PMI e P.IVA italiane.

## Stack
HTML/CSS/JS vanilla. Font: JetBrains Mono + Space Grotesk (Google Fonts).
File condivisi: `assets/site.css`, `assets/site.js`, `image-slot.js`.
Niente framework, niente CMS, niente WordPress.

## Repo
GitHub: `alessiopesit-boop/alessiopes-web`
Deploy pianificato: Netlify o Cloudflare Pages (statico, niente build step).

## Segnaposto da sostituire prima del deploy
- Numero WhatsApp: `390000000000` → numero reale
- URL progetti in `progetti.html`: tutti `href="#"` → URL reali
- Foto Alessio: slot `image-slot` in `chi-sono.html` e `index.html`
- P.IVA: segnaposto in `privacy.html` e footer → da inserire quando aperta

## Pagine
- `index.html` — Home (hero + servizi + come lavoro + lavori recenti + recensioni)
- `servizi.html` — Servizi e prezzi (4 piani + sezione Google marketing + FAQ)
- `preventivo.html` — Configuratore preventivo → messaggio WhatsApp precompilato
- `progetti.html` — Portfolio con toggle griglia/elenco
- `chi-sono.html` — Bio + stack tecnico
- `contatti.html` — WhatsApp primario + email
- `faq.html` — 25 domande in 5 gruppi tematici
- `google.html` — Servizi Google (Profilo, Ads, LSA)
- `privacy.html` — Privacy & cookie (GDPR)
- `404.html` — Pagina not found

## Modello di business
- Regime forfettario → prezzi IVA inclusa ("prezzo finale · nessuna IVA da aggiungere")
- Hosting lo rivende Alessio; codice consegnato solo su richiesta a saldo
- Canone annuo dal 2° anno (dominio + hosting)
- Budget Google Ads/LSA è a carico del cliente, pagato direttamente a Google

## Non implementare
- `Biglietti da visita.html` — idea futura, non nel sito
- `Admin - Centro di controllo.html` — dashboard separata, non nel sito
