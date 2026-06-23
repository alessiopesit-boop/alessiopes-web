// Rigenera le icone PNG (favicon PWA / apple-touch) dalla tile terminale ">_" del logo.
// Uso una-tantum:  npm i sharp --no-save  &&  node scripts/gen-icons.mjs
// I PNG generati (public/icon-180|192|512.png) vanno committati; sharp non serve a build/runtime.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Glifi ">_" come vettore (niente dipendenza da font), full-bleed per il maskable.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#14161f"/>
  <path d="M150 170 L238 256 L150 342" fill="none" stroke="#00d8ff" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="262" y="314" width="110" height="30" rx="6" fill="#e2e8f8"/>
</svg>`;

const sizes = [180, 192, 512];
for (const size of sizes) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(out, `icon-${size}.png`));
  console.log(`icon-${size}.png`);
}
