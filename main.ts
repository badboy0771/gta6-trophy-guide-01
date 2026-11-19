// Leonida Trophy Guide — entry program (Node 22, standard library only).
// The guide itself is plain static files under app/: index.html opens in a
// browser, app.js renders the 55-trophy checklist from app/data/trophies.json,
// and style.css gives it its look. No build step, no network at run time.
// This program hands the guide in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there
// with buildDossier from the kit's vendored library. vendor/makefun-frontend.ts
// is left exactly as the kit shipped it — the scorer rebuilds the dossier
// with its own copy and compares byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR set:
//   MAKEFUN_OUTPUT_DIR=/tmp/trophy-out node main.ts
// Inside the grader the output directory is /output.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Paths are resolved against this file, never the working directory, so the
// program works when run from anywhere (the grader runs it from /bot).
const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: only text_max_bytes shapes the bytes; the others
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 48 MiB of
// app files, counted beside /output's own 1000-entry cap).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
