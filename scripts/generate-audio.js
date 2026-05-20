// Usage:  node scripts/generate-audio.js          — skip existing files
//         node scripts/generate-audio.js --force   — regenerate all

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const FORCE = process.argv.includes('--force');

if (!API_KEY) { console.error('ERROR: ELEVENLABS_API_KEY missing in .env'); process.exit(1); }
if (!VOICE_ID) { console.error('ERROR: ELEVENLABS_VOICE_ID missing in .env'); process.exit(1); }

// All 36 audio assets for ISSUE-010 (find-the-letter module)
// file — path relative to assets/sounds/
// text — spoken Polish content
const ASSETS = [
  // Module registry label
  { file: 'find-the-letter/module-label.mp3', text: 'Znajdź literę' },

  // Shared phrases
  { file: 'shared/phrases/find.mp3',        text: 'Znajdź' },
  { file: 'shared/phrases/confirm-its.mp3', text: 'Tak, to' },
  { file: 'shared/phrases/try-again.mp3',   text: 'Spróbuj jeszcze raz' },

  // Shared letters — 32 Polish alphabet letters
  { file: 'shared/letters/a.mp3',        text: 'A' },
  { file: 'shared/letters/a-ogonek.mp3', text: 'Ą' },
  { file: 'shared/letters/b.mp3',        text: 'B' },
  { file: 'shared/letters/c.mp3',        text: 'C' },
  { file: 'shared/letters/c-kreska.mp3', text: 'Ć' },
  { file: 'shared/letters/d.mp3',        text: 'D' },
  { file: 'shared/letters/e.mp3',        text: 'E' },
  { file: 'shared/letters/e-ogonek.mp3', text: 'Ę' },
  { file: 'shared/letters/f.mp3',        text: 'F' },
  { file: 'shared/letters/g.mp3',        text: 'G' },
  { file: 'shared/letters/h.mp3',        text: 'H' },
  { file: 'shared/letters/i.mp3',        text: 'I' },
  { file: 'shared/letters/j.mp3',        text: 'J' },
  { file: 'shared/letters/k.mp3',        text: 'K' },
  { file: 'shared/letters/l.mp3',        text: 'L' },
  { file: 'shared/letters/l-kreska.mp3', text: 'Ł' },
  { file: 'shared/letters/m.mp3',        text: 'M' },
  { file: 'shared/letters/n.mp3',        text: 'N' },
  { file: 'shared/letters/n-kreska.mp3', text: 'Ń' },
  { file: 'shared/letters/o.mp3',        text: 'O' },
  { file: 'shared/letters/o-kreska.mp3', text: 'Ó' },
  { file: 'shared/letters/p.mp3',        text: 'P' },
  { file: 'shared/letters/r.mp3',        text: 'R' },
  { file: 'shared/letters/s.mp3',        text: 'S' },
  { file: 'shared/letters/s-kreska.mp3', text: 'Ś' },
  { file: 'shared/letters/t.mp3',        text: 'T' },
  { file: 'shared/letters/u.mp3',        text: 'U' },
  { file: 'shared/letters/w.mp3',        text: 'W' },
  { file: 'shared/letters/y.mp3',        text: 'Y' },
  { file: 'shared/letters/z.mp3',        text: 'Z' },
  { file: 'shared/letters/z-kreska.mp3', text: 'Ź' },
  { file: 'shared/letters/z-kropka.mp3', text: 'Ż' },
];

const SOUNDS_ROOT = path.join(__dirname, '..', 'assets', 'sounds');
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

async function generateOne(text, relPath) {
  const outputPath = path.join(SOUNDS_ROOT, relPath);

  if (!FORCE && fs.existsSync(outputPath)) {
    console.log(`SKIP ${relPath}  (already exists)`);
    return 'skipped';
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) throw new Error('Unauthorized — check ELEVENLABS_API_KEY');
    if (response.status === 422) throw new Error('Unprocessable — check ELEVENLABS_VOICE_ID');
    if (response.status === 429) throw new Error('Rate limit exceeded — try again later');
    throw new Error(`API error ${response.status}: ${body}`);
  }

  const buffer = await response.arrayBuffer();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  const kb = Math.round(buffer.byteLength / 1024);
  console.log(`OK   ${relPath}  (${kb} KB)`);
  return 'ok';
}

async function main() {
  const toGenerate = FORCE
    ? ASSETS
    : ASSETS.filter(({ file }) => !fs.existsSync(path.join(SOUNDS_ROOT, file)));

  console.log(`Total: ${ASSETS.length} assets — ${toGenerate.length} to generate, ${ASSETS.length - toGenerate.length} already exist`);
  if (toGenerate.length === 0) { console.log('Nothing to do.'); return; }

  let ok = 0, skipped = 0, failed = 0;

  for (const { text, file } of ASSETS) {
    try {
      const result = await generateOne(text, file);
      if (result === 'skipped') skipped++; else ok++;
    } catch (err) {
      console.error(`FAIL ${file} — ${err.message}`);
      failed++;
      if (err.message.startsWith('Unauthorized') || err.message.startsWith('Rate limit')) break;
    }
  }

  console.log(`\nDone: ${ok} generated, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
