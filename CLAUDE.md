# alessiopes-web

Sito personale statico (HTML/CSS/JS vanilla). Nessun framework, nessun CMS.

## Stack

- HTML/CSS/JS puri, nessun build step
- Deploy: GitHub Pages via GitHub Actions
- Versioning: release-please (tipo `node`, legge `package.json`)
- Branch principale: `main`

## CI/CD

**Push su `main`** - deploy automatico su GitHub Pages (`alessiopesit-boop.github.io/alessiopes-web`).

**Release pubblicata** (da release-please) - ri-deploy sullo stesso URL. Quando si compra il dominio, configurare custom domain in GitHub Pages settings.

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
npm run serve   # server locale via npx serve
```
