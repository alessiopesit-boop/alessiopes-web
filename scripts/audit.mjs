// Lighthouse audit su tutte le pagine prerenderizzate (build di produzione).
//
// Uso:  npm run audit            (builda se serve, poi analizza tutte le rotte)
//       npm run audit -- --no-build   (salta la build, usa dist esistente)
//       npm run audit -- /servizi /preventivo   (solo alcune rotte)
//
// Serve la cartella statica dist/alessiopes-web/browser e gira Lighthouse
// (Chrome/Edge headless) su ogni rotta, poi stampa una tabella riassuntiva
// con i 4 punteggi e le metriche chiave (LCP, CLS, TBT). Esce con codice 1
// solo se una categoria deterministica (A11y/Best Practices/SEO) e' sotto 100;
// la performance e' informativa (vedi nota sulle soglie sotto). Usabile in CI.

import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist', 'alessiopes-web', 'browser');
const PORT = 4321;

// Solo le categorie DETERMINISTICHE fanno fallire l'audit (esito riproducibile,
// indipendente dalla macchina). La performance in locale dipende da CPU/carico e
// dalla throttling simulata di Lighthouse: la mostriamo come informativa ma non
// la usiamo come gate (l'autorita' sulla performance e' PageSpeed su infra Google).
const MIN = { accessibility: 100, 'best-practices': 100, seo: 100 };
const SOFT = { perf: 90, cls: 0.1, lcpMs: 2500, tbtMs: 200 }; // solo per il marker ⚠

const args = process.argv.slice(2);
const noBuild = args.includes('--no-build');
const detail = args.includes('--detail'); // elenca gli audit falliti per pagina
const onlyRoutes = args.filter((a) => !a.startsWith('--'));

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

function build() {
  console.log('› Build di produzione (npm run build)...');
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) {
    console.error('Build fallita.');
    process.exit(1);
  }
}

// Scansiona dist: ogni cartella con un index.html e' una rotta prerenderizzata.
async function discoverRoutes(base, prefix = '') {
  const routes = [];
  const entries = await readdir(base, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && e.name === 'index.html')) {
    routes.push(prefix === '' ? '/' : prefix);
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      routes.push(...(await discoverRoutes(join(base, e.name), `${prefix}/${e.name}`)));
    }
  }
  return routes;
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        let filePath = join(DIST, urlPath);
        // route prerenderizzata: /servizi -> /servizi/index.html
        if (!extname(filePath)) {
          const idx = join(filePath, 'index.html');
          filePath = existsSync(idx) ? idx : join(DIST, 'index.html');
        }
        const body = await readFile(filePath);
        res.writeHead(200, { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

function fmt(n) {
  return String(Math.round(n)).padStart(3);
}

async function run() {
  if (!noBuild) build();
  if (!existsSync(DIST)) {
    console.error(`Cartella build non trovata: ${DIST}\nLancia prima "npm run build".`);
    process.exit(1);
  }

  const server = await startServer();
  const all = (await discoverRoutes(DIST)).sort();
  const routes = onlyRoutes.length ? onlyRoutes : all;

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  const rows = [];
  let failed = false;

  for (const route of routes) {
    const url = `http://localhost:${PORT}${route}`;
    process.stdout.write(`› ${route} ... `);
    // Nessun terzo argomento: la config di default di Lighthouse e' gia' "mobile".
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
    });
    const c = result.lhr.categories;
    const a = result.lhr.audits;
    const row = {
      route,
      perf: c.performance.score * 100,
      a11y: c.accessibility.score * 100,
      bp: c['best-practices'].score * 100,
      seo: c.seo.score * 100,
      lcp: a['largest-contentful-paint'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
    };
    // Gate: solo categorie deterministiche. Marker soft: perf/web vitals locali.
    const bad =
      row.a11y < MIN.accessibility || row.bp < MIN['best-practices'] || row.seo < MIN.seo;
    const slow =
      row.perf < SOFT.perf || row.cls > SOFT.cls || row.lcp > SOFT.lcpMs || row.tbt > SOFT.tbtMs;
    row.bad = bad;
    row.slow = slow;
    if (detail) {
      // Elenca gli audit con punteggio < 1 nelle categorie deterministiche.
      for (const cat of ['accessibility', 'best-practices']) {
        const refs = result.lhr.categories[cat].auditRefs;
        const fails = refs
          .map((ref) => a[ref.id])
          .filter((au) => au && au.score !== null && au.score < 1);
        if (fails.length) {
          console.log(`    [${cat}]`);
          for (const au of fails) console.log(`      - ${au.title}`);
        }
      }
      // Elementi che causano layout shift (utile per il CLS).
      const ls = a['layout-shift-elements'];
      if (ls?.details?.items?.length) {
        console.log('    [layout-shift]');
        for (const it of ls.details.items.slice(0, 4)) {
          console.log(`      - ${(it.node?.snippet || it.node?.selector || '?').slice(0, 80)}`);
        }
      }
    }

    if (bad) failed = true;
    rows.push(row);
    const label = bad ? 'DA RIVEDERE' : slow ? 'ok (perf locale ⚠)' : 'ok';
    console.log(
      `${label}  ` +
        `[P ${fmt(row.perf)} A ${fmt(row.a11y)} BP ${fmt(row.bp)} SEO ${fmt(row.seo)} | ` +
        `LCP ${(row.lcp / 1000).toFixed(2)}s CLS ${row.cls.toFixed(3)} TBT ${Math.round(row.tbt)}ms]`,
    );
  }

  // chrome-launcher su Windows a volte lancia EPERM pulendo il temp: innocuo.
  try {
    await chrome.kill();
  } catch {
    /* ignore */
  }
  server.close();

  console.log('\n  Rotta                                  Perf  A11y  BP  SEO   LCP    CLS    TBT');
  console.log('  ' + '-'.repeat(82));
  for (const r of rows) {
    const mark = r.bad ? '✗' : r.slow ? '⚠' : ' ';
    console.log(
      `${mark} ${r.route.padEnd(38)}${fmt(r.perf)}  ${fmt(r.a11y)}  ${fmt(r.bp)} ${fmt(r.seo)}  ` +
        `${(r.lcp / 1000).toFixed(2)}s  ${r.cls.toFixed(3)}  ${Math.round(r.tbt)}ms`,
    );
  }
  console.log(
    `\n  Gate (deterministico): A11y/BP/SEO = 100. ` +
      `⚠ = perf locale sotto soglia (Perf<${SOFT.perf}, CLS>${SOFT.cls}, LCP>${SOFT.lcpMs / 1000}s, TBT>${SOFT.tbtMs}ms),` +
      `\n  informativo: la performance assoluta in locale non e' comparabile a PageSpeed (infra Google).`,
  );
  console.log(
    failed
      ? "\n  ✗ Una o piu' pagine hanno problemi deterministici (a11y/best-practices/seo)."
      : '\n  ✓ A11y, Best Practices e SEO a posto su tutte le pagine.',
  );

  process.exit(failed ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
