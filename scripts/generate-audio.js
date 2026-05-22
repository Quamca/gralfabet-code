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

// All audio assets
// file — path relative to assets/sounds/
// text — spoken Polish content
const ASSETS = [
  // find-the-letter module label
  { file: 'find-the-letter/module-label.mp3', text: 'Znajdź literę' },

  // missing-letter module label
  { file: 'missing-letter/module-label.mp3', text: 'Brakująca litera' },

  // missing-letter word context — batch 1 (A, Ą, B, C×1)
  { file: 'missing-letter/jak-auto.mp3',       text: 'jak auto' },
  { file: 'missing-letter/jak-arbuz.mp3',      text: 'jak arbuz' },
  { file: 'missing-letter/jak-aparat.mp3',     text: 'jak aparat' },
  { file: 'missing-letter/w-słowie-ząb.mp3',   text: 'w słowie ząb' },
  { file: 'missing-letter/w-słowie-wąs.mp3',   text: 'w słowie wąs' },
  { file: 'missing-letter/w-słowie-bąk.mp3',   text: 'w słowie bąk' },
  { file: 'missing-letter/jak-but.mp3',        text: 'jak but' },
  { file: 'missing-letter/jak-balon.mp3',      text: 'jak balon' },
  { file: 'missing-letter/jak-banan.mp3',      text: 'jak banan' },
  { file: 'missing-letter/jak-cebula.mp3',     text: 'jak cebula' },

  // missing-letter word context — batch 2 (C–Ż)
  { file: 'missing-letter/jak-cytryna.mp3',      text: 'jak cytryna' },
  { file: 'missing-letter/jak-cukierek.mp3',     text: 'jak cukierek' },
  { file: 'missing-letter/jak-ćma.mp3',          text: 'jak ćma' },
  { file: 'missing-letter/jak-ćwiek.mp3',        text: 'jak ćwiek' },
  { file: 'missing-letter/jak-dom.mp3',          text: 'jak dom' },
  { file: 'missing-letter/jak-dym.mp3',          text: 'jak dym' },
  { file: 'missing-letter/jak-dynia.mp3',        text: 'jak dynia' },
  { file: 'missing-letter/jak-ekran.mp3',        text: 'jak ekran' },
  { file: 'missing-letter/jak-elf.mp3',          text: 'jak elf' },
  { file: 'missing-letter/jak-emu.mp3',          text: 'jak emu' },
  { file: 'missing-letter/w-słowie-ręka.mp3',    text: 'w słowie ręka' },
  { file: 'missing-letter/w-słowie-gęś.mp3',     text: 'w słowie gęś' },
  { file: 'missing-letter/w-słowie-pęk.mp3',     text: 'w słowie pęk' },
  { file: 'missing-letter/jak-foka.mp3',         text: 'jak foka' },
  { file: 'missing-letter/jak-farba.mp3',        text: 'jak farba' },
  { file: 'missing-letter/jak-fotel.mp3',        text: 'jak fotel' },
  { file: 'missing-letter/jak-góra.mp3',         text: 'jak góra' },
  { file: 'missing-letter/jak-garnek.mp3',       text: 'jak garnek' },
  { file: 'missing-letter/jak-gitara.mp3',       text: 'jak gitara' },
  { file: 'missing-letter/jak-hamak.mp3',        text: 'jak hamak' },
  { file: 'missing-letter/jak-herbata.mp3',      text: 'jak herbata' },
  { file: 'missing-letter/jak-hulajnoga.mp3',    text: 'jak hulajnoga' },
  { file: 'missing-letter/jak-igła.mp3',         text: 'jak igła' },
  { file: 'missing-letter/jak-indyk.mp3',        text: 'jak indyk' },
  { file: 'missing-letter/jak-iskra.mp3',        text: 'jak iskra' },
  { file: 'missing-letter/jak-jajko.mp3',        text: 'jak jajko' },
  { file: 'missing-letter/jak-jabłko.mp3',       text: 'jak jabłko' },
  { file: 'missing-letter/jak-jeż.mp3',          text: 'jak jeż' },
  { file: 'missing-letter/jak-kot.mp3',          text: 'jak kot' },
  { file: 'missing-letter/jak-kura.mp3',         text: 'jak kura' },
  { file: 'missing-letter/jak-klocki.mp3',       text: 'jak klocki' },
  { file: 'missing-letter/jak-lalka.mp3',        text: 'jak lalka' },
  { file: 'missing-letter/jak-lampa.mp3',        text: 'jak lampa' },
  { file: 'missing-letter/jak-lis.mp3',          text: 'jak lis' },
  { file: 'missing-letter/jak-łapa.mp3',         text: 'jak łapa' },
  { file: 'missing-letter/jak-łódka.mp3',        text: 'jak łódka' },
  { file: 'missing-letter/jak-łyżka.mp3',        text: 'jak łyżka' },
  { file: 'missing-letter/jak-mama.mp3',         text: 'jak mama' },
  { file: 'missing-letter/jak-motyl.mp3',        text: 'jak motyl' },
  { file: 'missing-letter/jak-mleko.mp3',        text: 'jak mleko' },
  { file: 'missing-letter/jak-nos.mp3',          text: 'jak nos' },
  { file: 'missing-letter/jak-narty.mp3',        text: 'jak narty' },
  { file: 'missing-letter/jak-nuta.mp3',         text: 'jak nuta' },
  { file: 'missing-letter/w-słowie-koń.mp3',     text: 'w słowie koń' },
  { file: 'missing-letter/w-słowie-słoń.mp3',    text: 'w słowie słoń' },
  { file: 'missing-letter/w-słowie-dłoń.mp3',    text: 'w słowie dłoń' },
  { file: 'missing-letter/jak-oko.mp3',          text: 'jak oko' },
  { file: 'missing-letter/jak-osa.mp3',          text: 'jak osa' },
  { file: 'missing-letter/jak-okno.mp3',         text: 'jak okno' },
  { file: 'missing-letter/w-słowie-góra.mp3',    text: 'w słowie góra' },
  { file: 'missing-letter/w-słowie-król.mp3',    text: 'w słowie król' },
  { file: 'missing-letter/w-słowie-stół.mp3',    text: 'w słowie stół' },
  { file: 'missing-letter/jak-pies.mp3',         text: 'jak pies' },
  { file: 'missing-letter/jak-piłka.mp3',        text: 'jak piłka' },
  { file: 'missing-letter/jak-parasol.mp3',      text: 'jak parasol' },
  { file: 'missing-letter/jak-rak.mp3',          text: 'jak rak' },
  { file: 'missing-letter/jak-ryba.mp3',         text: 'jak ryba' },
  { file: 'missing-letter/jak-rower.mp3',        text: 'jak rower' },
  { file: 'missing-letter/jak-sok.mp3',          text: 'jak sok' },
  { file: 'missing-letter/jak-sowa.mp3',         text: 'jak sowa' },
  { file: 'missing-letter/jak-ser.mp3',          text: 'jak ser' },
  { file: 'missing-letter/jak-ślimak.mp3',       text: 'jak ślimak' },
  { file: 'missing-letter/jak-świeca.mp3',       text: 'jak świeca' },
  { file: 'missing-letter/jak-śnieg.mp3',        text: 'jak śnieg' },
  { file: 'missing-letter/jak-tort.mp3',         text: 'jak tort' },
  { file: 'missing-letter/jak-tata.mp3',         text: 'jak tata' },
  { file: 'missing-letter/jak-trawa.mp3',        text: 'jak trawa' },
  { file: 'missing-letter/jak-ucho.mp3',         text: 'jak ucho' },
  { file: 'missing-letter/jak-ul.mp3',           text: 'jak ul' },
  { file: 'missing-letter/jak-usta.mp3',         text: 'jak usta' },
  { file: 'missing-letter/jak-woda.mp3',         text: 'jak woda' },
  { file: 'missing-letter/jak-worek.mp3',        text: 'jak worek' },
  { file: 'missing-letter/jak-wilk.mp3',         text: 'jak wilk' },
  { file: 'missing-letter/w-słowie-byk.mp3',     text: 'w słowie byk' },
  { file: 'missing-letter/w-słowie-dym.mp3',     text: 'w słowie dym' },
  { file: 'missing-letter/w-słowie-mysz.mp3',    text: 'w słowie mysz' },
  { file: 'missing-letter/jak-zamek.mp3',        text: 'jak zamek' },
  { file: 'missing-letter/jak-zebra.mp3',        text: 'jak zebra' },
  { file: 'missing-letter/jak-zupa.mp3',         text: 'jak zupa' },
  { file: 'missing-letter/jak-źrebak.mp3',       text: 'jak źrebak' },
  { file: 'missing-letter/jak-źródło.mp3',       text: 'jak źródło' },
  { file: 'missing-letter/jak-żaba.mp3',         text: 'jak żaba' },
  { file: 'missing-letter/jak-żółw.mp3',         text: 'jak żółw' },
  { file: 'missing-letter/jak-żyrafa.mp3',       text: 'jak żyrafa' },

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
