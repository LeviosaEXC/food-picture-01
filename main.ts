// food-picture-01 entrypoint (Node 22, stdlib only).
//
// Copies the single entry image beside this file to the output directory.
// The gate checks the written file by magic bytes, not by its name: entry.png
// holds JPEG bytes (magic FFD8 ... FFD9), 1024x1024, 255,455 bytes — within
// the gate limits of one image, <=1 MiB (1,048,576 B), <=1024x1024.
// The run is deterministic: same input bytes produce byte-identical output.
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));

// Fail loudly if the copy came out truncated: a short write would otherwise
// reach the gate silently. Source and written sizes must match exactly.
const written = join(outDir, 'entry.png');
if (statSync(source).size !== statSync(written).size) {
  console.error('entry.png copy size mismatch: source and output differ');
  process.exit(1);
}
