const fs   = require('fs');
const path = require('path');
const https = require('https');

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const OUT_DIR  = path.join(__dirname, '..', 'assets', 'sounds', 'letter-trace');

if (!API_KEY || !VOICE_ID) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID');
  process.exit(1);
}

// All 32 Polish letters with their slugs and display forms
const LETTERS = [
  { letter: 'A', audioKey: 'a',        duze: 'A',  male: 'a'  },
  { letter: 'Ą', audioKey: 'a-ogonek', duze: 'Ą',  male: 'ą'  },
  { letter: 'B', audioKey: 'b',        duze: 'B',  male: 'b'  },
  { letter: 'C', audioKey: 'c',        duze: 'C',  male: 'c'  },
  { letter: 'Ć', audioKey: 'c-kreska', duze: 'Ć',  male: 'ć'  },
  { letter: 'D', audioKey: 'd',        duze: 'D',  male: 'd'  },
  { letter: 'E', audioKey: 'e',        duze: 'E',  male: 'e'  },
  { letter: 'Ę', audioKey: 'e-ogonek', duze: 'Ę',  male: 'ę'  },
  { letter: 'F', audioKey: 'f',        duze: 'F',  male: 'f'  },
  { letter: 'G', audioKey: 'g',        duze: 'G',  male: 'g'  },
  { letter: 'H', audioKey: 'h',        duze: 'H',  male: 'h'  },
  { letter: 'I', audioKey: 'i',        duze: 'I',  male: 'i'  },
  { letter: 'J', audioKey: 'j',        duze: 'J',  male: 'j'  },
  { letter: 'K', audioKey: 'k',        duze: 'K',  male: 'k'  },
  { letter: 'L', audioKey: 'l',        duze: 'L',  male: 'l'  },
  { letter: 'Ł', audioKey: 'l-kreska', duze: 'Ł',  male: 'ł'  },
  { letter: 'M', audioKey: 'm',        duze: 'M',  male: 'm'  },
  { letter: 'N', audioKey: 'n',        duze: 'N',  male: 'n'  },
  { letter: 'Ń', audioKey: 'n-kreska', duze: 'Ń',  male: 'ń'  },
  { letter: 'O', audioKey: 'o',        duze: 'O',  male: 'o'  },
  { letter: 'Ó', audioKey: 'o-kreska', duze: 'Ó',  male: 'ó'  },
  { letter: 'P', audioKey: 'p',        duze: 'P',  male: 'p'  },
  { letter: 'R', audioKey: 'r',        duze: 'R',  male: 'r'  },
  { letter: 'S', audioKey: 's',        duze: 'S',  male: 's'  },
  { letter: 'Ś', audioKey: 's-kreska', duze: 'Ś',  male: 'ś'  },
  { letter: 'T', audioKey: 't',        duze: 'T',  male: 't'  },
  { letter: 'U', audioKey: 'u',        duze: 'U',  male: 'u'  },
  { letter: 'W', audioKey: 'w',        duze: 'W',  male: 'w'  },
  { letter: 'Y', audioKey: 'y',        duze: 'Y',  male: 'y'  },
  { letter: 'Z', audioKey: 'z',        duze: 'Z',  male: 'z'  },
  { letter: 'Ź', audioKey: 'z-kreska', duze: 'Ź',  male: 'ź'  },
  { letter: 'Ż', audioKey: 'z-kropka', duze: 'Ż',  male: 'ż'  },
];

// Build full list: 64 entries
const TASKS = [];
for (const entry of LETTERS) {
  TASKS.push({ filename: `narysuj-duze-${entry.audioKey}.mp3`, text: `Narysuj duże ${entry.duze}` });
  TASKS.push({ filename: `narysuj-male-${entry.audioKey}.mp3`, text: `Narysuj małe ${entry.male}` });
}

function ttsRequest(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    });
    const options = {
      hostname: 'api.elevenlabs.io',
      path:     `/v1/text-to-speech/${VOICE_ID}`,
      method:   'POST',
      headers:  {
        'xi-api-key':    API_KEY,
        'Content-Type':  'application/json',
        'Accept':        'audio/mpeg',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', d => { err += d; });
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)));
        return;
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const skip = TASKS.filter(t => fs.existsSync(path.join(OUT_DIR, t.filename)));
  const todo = TASKS.filter(t => !fs.existsSync(path.join(OUT_DIR, t.filename)));
  if (skip.length) console.log(`Skipping ${skip.length} already generated files.`);
  console.log(`Generating ${todo.length} files…\n`);

  for (const task of todo) {
    const outPath = path.join(OUT_DIR, task.filename);
    process.stdout.write(`  ${task.filename}  "${task.text}" … `);
    try {
      const audio = await ttsRequest(task.text);
      fs.writeFileSync(outPath, audio);
      console.log(`OK (${Math.round(audio.length / 1024)} KB)`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
    // Brief pause to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('\nDone.');
}

run();
