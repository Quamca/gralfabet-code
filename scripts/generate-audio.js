// Usage:  node scripts/generate-audio.js
// Generates a single test file: assets/sounds/shared/letters/a.mp3
// Extend the ASSETS array below to generate the full set.

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY) {
  console.error('ERROR: ELEVENLABS_API_KEY missing in .env');
  process.exit(1);
}
if (!VOICE_ID) {
  console.error('ERROR: ELEVENLABS_VOICE_ID missing in .env');
  process.exit(1);
}

// ---- Assets to generate ------------------------------------------------
// Extend this array when generating the full set.
// Format: { text, file }
//   text — spoken content sent to ElevenLabs
//   file — path relative to assets/sounds/
const ASSETS = [
  { text: 'A', file: 'shared/letters/a.mp3' },
];
// ------------------------------------------------------------------------

const SOUNDS_ROOT = path.join(__dirname, '..', 'assets', 'sounds');
const API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

async function generateOne(text, relPath) {
  const outputPath = path.join(SOUNDS_ROOT, relPath);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) throw new Error(`Unauthorized — check ELEVENLABS_API_KEY`);
    if (response.status === 422) throw new Error(`Unprocessable — check ELEVENLABS_VOICE_ID`);
    if (response.status === 429) throw new Error(`Rate limit exceeded — try again later`);
    throw new Error(`API error ${response.status}: ${body}`);
  }

  const buffer = await response.arrayBuffer();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  const kb = Math.round(buffer.byteLength / 1024);
  console.log(`OK  ${relPath}  (${kb} KB)`);
}

async function main() {
  console.log(`Generating ${ASSETS.length} file(s) with voice ${VOICE_ID.slice(0, 8)}...`);
  let ok = 0;
  let failed = 0;

  for (const { text, file } of ASSETS) {
    try {
      await generateOne(text, file);
      ok++;
    } catch (err) {
      console.error(`FAIL ${file} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${ok} OK, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
