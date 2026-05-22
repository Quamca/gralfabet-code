// Usage:  node scripts/generate-images.js jabłko       — generate one image (test)
//         node scripts/generate-images.js --all        — generate all missing
//         node scripts/generate-images.js --all --force — regenerate all

require('dotenv').config();
const fs   = require('fs');
const path = require('path');

const API_KEY = process.env.OPENAI_API_KEY;
const FORCE   = process.argv.includes('--force');
const ALL     = process.argv.includes('--all');
const SINGLE  = process.argv.find((a) => !a.startsWith('--') && a !== process.argv[0] && a !== process.argv[1]);

if (!API_KEY) { console.error('ERROR: OPENAI_API_KEY missing in .env'); process.exit(1); }

const STYLE = `2D flat illustration, educational calm aesthetic for a Polish children's alphabet app (ages 3–6). Single isolated object centered on warm cream background (#FDF8F0). Soft organic rounded shapes, geometric simplification, minimum detail, thick clear readable silhouette. Muted calm pastel colors — no neons, no aggressive contrasts, no pure white background. No black outlines — use a slightly darker shade of the same color family as a subtle border if needed. No texture, no gradients, no 3D rendering, no heavy shadows, no background decorations or scenes, no text, no labels. Generous breathing negative space around the object. Not gamified, not Pixar-style, not fantasy children's illustration, not stock clipart. Soft rounded shapes that look like they could gently move. Scandinavian children's book meets modern digital education materials. Calm, safe, curious mood.`;

// Polish word → English description for DALL-E 3
const IMAGES = {
  'auto':      'a simple toy car, side view',
  'arbuz':     'a watermelon, whole with a slice cut showing red flesh',
  'aparat':    'a simple camera',
  'ząb':       'a single white tooth',
  'wąs':       'a curly mustache',
  'bąk':       'a bumblebee with yellow and black stripes',
  'but':       'a simple boot or shoe, side view',
  'balon':     'a round balloon with a string',
  'banan':     'a banana',
  'cebula':    'an onion with papery outer skin',
  'cytryna':   'a lemon',
  'cukierek':  'a wrapped round hard candy',
  'ćma':       'a moth with spread wings, muted brown tones',
  'ćwiek':     'a metal stud or rivet',
  'dom':       'a simple house with a triangular roof and door',
  'dym':       'a soft puffy cloud of smoke',
  'dynia':     'an orange pumpkin',
  'ekran':     'a simple flat monitor screen on a stand',
  'elf':       'a friendly small elf with a pointed hat',
  'emu':       'an emu bird, side view, tall with fluffy feathers',
  'ręka':      'a hand with fingers, palm facing viewer',
  'gęś':       'a goose, side view, white feathers',
  'pęk':       'a bunch of keys on a ring',
  'foka':      'a seal, side view, lying down',
  'farba':     'a paint can with a drip of colorful paint on the side',
  'fotel':     'a cozy rounded armchair',
  'góra':      'a mountain peak with snow on top',
  'garnek':    'a cooking pot with a lid and two handles',
  'gitara':    'an acoustic guitar, front view',
  'hamak':     'a hammock hanging between two simple posts',
  'herbata':   'a cup of tea on a saucer with a tea bag string',
  'hulajnoga': 'a kick scooter, side view',
  'igła':      'a sewing needle with a loop of thread through the eye',
  'indyk':     'a turkey bird, side view, with fanned tail',
  'iskra':     'a single bright spark or tiny flame',
  'jajko':     'a single egg',
  'jabłko':    'a red apple with a small green leaf',
  'jeż':       'a hedgehog with spines, side view',
  'kot':       'a cat sitting, side view, calm expression',
  'kura':      'a hen, side view',
  'klocki':    'three colorful stacked building blocks',
  'lalka':     'a simple rag doll with yarn hair',
  'lampa':     'a simple floor lamp with a round shade',
  'lis':       'a fox sitting, side view, orange fur',
  'łapa':      'a rounded bear or dog paw',
  'łódka':     'a small wooden rowing boat, side view',
  'łyżka':     'a spoon, top view',
  'mama':      'a simple stylized woman figure, calm and friendly, minimal features',
  'motyl':     'a butterfly with spread wings, viewed from above',
  'mleko':     'a glass of white milk',
  'nos':       'a simple rounded nose shape',
  'narty':     'a pair of skis with poles, lying crossed',
  'nuta':      'a single musical quarter note',
  'koń':       'a horse, side view, standing',
  'słoń':      'an elephant, side view',
  'dłoń':      'an open palm of a hand, fingers spread',
  'oko':       'a single eye with eyelashes, front view',
  'osa':       'a wasp with yellow and black stripes, side view',
  'okno':      'a simple window with a cross frame and blue panes',
  'król':      'a royal crown with jewels',
  'stół':      'a simple wooden table, side view',
  'pies':      'a dog sitting, side view, friendly face',
  'piłka':     'a round colorful ball',
  'parasol':   'an open umbrella, viewed from a slight angle',
  'rak':       'a crayfish or small lobster, side view',
  'ryba':      'a fish, side view, with fins and tail',
  'rower':     'a bicycle, side view',
  'sok':       'a tall glass of orange juice with a straw',
  'sowa':      'an owl, front view, with big round eyes',
  'ser':       'a wedge of yellow cheese with round holes',
  'ślimak':    'a snail with a spiral shell, side view',
  'świeca':    'a lit candle with a small warm flame and melting wax',
  'śnieg':     'a single large snowflake',
  'tort':      'a birthday cake with two candles on top',
  'tata':      'a simple stylized man figure, calm and friendly, minimal features',
  'trawa':     'a small clump of green grass blades',
  'ucho':      'a single human ear, side view',
  'ul':        'a wooden beehive box with a small entrance hole and two bees nearby',
  'usta':      'a pair of lips, front view',
  'woda':      'a single large water drop',
  'worek':     'a simple rounded cloth sack tied at the top',
  'wilk':      'a wolf, side view, standing, grey fur',
  'byk':       'a bull, side view, stocky build',
  'mysz':      'a mouse, side view, with round ears and long tail',
  'zamek':     'a small castle with two towers and a gate',
  'zebra':     'a zebra, side view, with black and white stripes',
  'zupa':      'a bowl of soup with steam rising',
  'źrebak':    'a young foal, side view, standing',
  'źródło':    'a natural water spring bubbling gently from smooth rocks',
  'żaba':      'a frog, front view, sitting on ground',
  'żółw':      'a turtle, side view, with patterned shell',
  'żyrafa':    'a giraffe, full body, side view, with long neck and spots',
};

const IMAGES_ROOT = path.join(__dirname, '..', 'assets', 'images', 'missing-letter');

async function generateOne(word) {
  const description = IMAGES[word];
  if (!description) {
    console.error(`ERROR: Unknown word "${word}". Available: ${Object.keys(IMAGES).join(', ')}`);
    process.exit(1);
  }

  const outputPath = path.join(IMAGES_ROOT, `${word}.png`);

  if (!FORCE && fs.existsSync(outputPath)) {
    console.log(`SKIP ${word}.png  (already exists)`);
    return 'skipped';
  }

  const prompt = `${STYLE} The object: ${description}.`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024', response_format: 'url' }),
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 401) throw new Error('Unauthorized — check OPENAI_API_KEY');
    if (response.status === 429) throw new Error('Rate limit — try again in a moment');
    throw new Error(`API error ${response.status}: ${body}`);
  }

  const json = await response.json();
  const imageUrl = json.data[0].url;

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error(`Failed to download image: ${imageResponse.status}`);

  const buffer = await imageResponse.arrayBuffer();
  fs.mkdirSync(IMAGES_ROOT, { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  const kb = Math.round(buffer.byteLength / 1024);
  console.log(`OK   ${word}.png  (${kb} KB)`);
  return 'ok';
}

async function main() {
  if (!ALL && !SINGLE) {
    console.error('Usage:');
    console.error('  node scripts/generate-images.js <word>        — single image');
    console.error('  node scripts/generate-images.js --all         — all missing');
    console.error('  node scripts/generate-images.js --all --force — regenerate all');
    process.exit(1);
  }

  const words = ALL ? Object.keys(IMAGES) : [SINGLE];
  const toGenerate = FORCE ? words : words.filter((w) => !fs.existsSync(path.join(IMAGES_ROOT, `${w}.png`)));

  console.log(`Total: ${words.length} images — ${toGenerate.length} to generate, ${words.length - toGenerate.length} already exist`);
  if (toGenerate.length === 0) { console.log('Nothing to do.'); return; }

  let ok = 0, skipped = 0, failed = 0;

  for (const word of words) {
    try {
      const result = await generateOne(word);
      if (result === 'skipped') skipped++; else ok++;
    } catch (err) {
      console.error(`FAIL ${word} — ${err.message}`);
      failed++;
      if (err.message.startsWith('Unauthorized') || err.message.startsWith('Rate limit')) break;
    }
  }

  console.log(`\nDone: ${ok} generated, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
