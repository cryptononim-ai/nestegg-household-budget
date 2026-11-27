// NestEgg — a household budget site for the make.fun bounty
// "Make the best household budget site" (best-household-budget-site-20261126-1457).
//
// The site is plain static files in app/ (index.html, CSS, ES modules, no
// build step, no network). This program hands it in: it copies app/ and
// screenshots/ from beside this file into /output and writes
// /output/dossier.json with the vendored make.fun library — the summary the
// judge reads (screenshots, first-load files and bytes, source outline).
//
// vendor/makefun-frontend.ts is the kit's copy, unchanged: the scorer
// rebuilds the dossier with its own copy and compares byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (Node 22 or later, standard library only.)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the rest
// refuse an entry the scorer would refuse — more than 4 screenshots or one
// over 256 KiB, more than 993 files and directories in app/ or 16 MiB of
// app files (app/ counts beside /output's own 1000-entry cap, together
// with screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
