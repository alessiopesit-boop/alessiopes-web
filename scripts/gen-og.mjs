// Rigenera la social card public/og-image.png (1200x630) col logo/brand attuale.
// Uso una-tantum:  npm i @resvg/resvg-js wawoff2 --no-save  &&  node scripts/gen-og.mjs
// Decomprime i font .woff2 del sito in TTF (resvg non legge woff2) e renderizza l'SVG.
import { Resvg } from '@resvg/resvg-js';
import wawoff2 from 'wawoff2';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fonts = join(root, 'src', 'fonts');
const tmp = mkdtempSync(join(tmpdir(), 'ogfont-'));

// woff2 -> ttf per ogni peso usato
const weights = ['400', '500', '700', '800'];
const fontFiles = [];
for (const w of weights) {
  const ttf = Buffer.from(await wawoff2.decompress(readFileSync(join(fonts, `jetbrainsmono-${w}.woff2`))));
  const p = join(tmp, `jbm-${w}.ttf`);
  writeFileSync(p, ttf);
  fontFiles.push(p);
}

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#14161f"/>
  <circle cx="1080" cy="80" r="300" fill="#00d8ff" opacity="0.06"/>
  <rect x="0" y="0" width="1200" height="6" fill="#00d8ff" opacity="0.9"/>
  <text x="80" y="132" font-family="JetBrains Mono" font-size="26" font-weight="500" fill="#00d8ff">// sviluppo web su misura · per P.IVA e piccole attività</text>
  <text x="76" y="330" font-family="JetBrains Mono" font-weight="800" font-size="92" letter-spacing="-3"><tspan fill="#00d8ff">&gt;</tspan><tspan fill="#e2e8f8" dx="20">alessiopes</tspan><tspan fill="#00d8ff">.it</tspan><tspan fill="#00d8ff" dx="10">_</tspan></text>
  <text x="80" y="430" font-family="JetBrains Mono" font-size="38" font-weight="700" fill="#e2e8f8">Siti web, gestionali e app su misura.</text>
  <text x="80" y="486" font-family="JetBrains Mono" font-size="30" font-weight="400" fill="#9aa3bd">Niente WordPress. Dal primo incontro al sito, sempre io.</text>
  <text x="80" y="566" font-family="JetBrains Mono" font-size="24" font-weight="500" fill="#7e88a3">Alessio Pes</text>
</svg>`;

const png = new Resvg(svg, {
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'JetBrains Mono' },
  fitTo: { mode: 'width', value: 1200 },
}).render().asPng();

writeFileSync(join(root, 'public', 'og-image.png'), png);
console.log('og-image.png (1200x630)');
