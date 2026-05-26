export type LetterCase = 'duze' | 'male';

export interface LetterEntry {
  letter:      string;      // glyph drawn on canvas: 'A' or 'a'
  audioKey:    string;      // slug shared by duze+male: 'a', 'a-ogonek', …
  caze:        LetterCase;  // which audio file prefix to use
  trackingKey: string;      // stable key for future progress tracking: 'A', 'a', 'Ą', …
}

// Base alphabet — 32 letters, uppercase form + audioKey slug
const BASE: Array<{ upper: string; lower: string; audioKey: string }> = [
  { upper: 'A', lower: 'a', audioKey: 'a'        },
  { upper: 'Ą', lower: 'ą', audioKey: 'a-ogonek' },
  { upper: 'B', lower: 'b', audioKey: 'b'        },
  { upper: 'C', lower: 'c', audioKey: 'c'        },
  { upper: 'Ć', lower: 'ć', audioKey: 'c-kreska' },
  { upper: 'D', lower: 'd', audioKey: 'd'        },
  { upper: 'E', lower: 'e', audioKey: 'e'        },
  { upper: 'Ę', lower: 'ę', audioKey: 'e-ogonek' },
  { upper: 'F', lower: 'f', audioKey: 'f'        },
  { upper: 'G', lower: 'g', audioKey: 'g'        },
  { upper: 'H', lower: 'h', audioKey: 'h'        },
  { upper: 'I', lower: 'i', audioKey: 'i'        },
  { upper: 'J', lower: 'j', audioKey: 'j'        },
  { upper: 'K', lower: 'k', audioKey: 'k'        },
  { upper: 'L', lower: 'l', audioKey: 'l'        },
  { upper: 'Ł', lower: 'ł', audioKey: 'l-kreska' },
  { upper: 'M', lower: 'm', audioKey: 'm'        },
  { upper: 'N', lower: 'n', audioKey: 'n'        },
  { upper: 'Ń', lower: 'ń', audioKey: 'n-kreska' },
  { upper: 'O', lower: 'o', audioKey: 'o'        },
  { upper: 'Ó', lower: 'ó', audioKey: 'o-kreska' },
  { upper: 'P', lower: 'p', audioKey: 'p'        },
  { upper: 'R', lower: 'r', audioKey: 'r'        },
  { upper: 'S', lower: 's', audioKey: 's'        },
  { upper: 'Ś', lower: 'ś', audioKey: 's-kreska' },
  { upper: 'T', lower: 't', audioKey: 't'        },
  { upper: 'U', lower: 'u', audioKey: 'u'        },
  { upper: 'W', lower: 'w', audioKey: 'w'        },
  { upper: 'Y', lower: 'y', audioKey: 'y'        },
  { upper: 'Z', lower: 'z', audioKey: 'z'        },
  { upper: 'Ź', lower: 'ź', audioKey: 'z-kreska' },
  { upper: 'Ż', lower: 'ż', audioKey: 'z-kropka' },
];

// Expand to 64 entries: duze then male for each base letter
export const ALL_LETTER_ENTRIES: LetterEntry[] = BASE.flatMap(({ upper, lower, audioKey }) => [
  { letter: upper, audioKey, caze: 'duze', trackingKey: upper },
  { letter: lower, audioKey, caze: 'male', trackingKey: lower },
]);

/**
 * Select `count` entries for a session.
 *
 * Pass an optional `scorer` to enable adaptive selection (higher score = higher
 * probability of being picked). Without a scorer, selection is uniform random.
 * This is the single swap-point for future progress-based planning.
 */
export function selectLetterEntries(
  count: number,
  scorer?: (entry: LetterEntry) => number
): LetterEntry[] {
  if (!scorer) return uniformSample(ALL_LETTER_ENTRIES, count);
  const weights = ALL_LETTER_ENTRIES.map(scorer);
  return weightedSample(ALL_LETTER_ENTRIES, weights, count);
}

function uniformSample<T>(pool: T[], n: number): T[] {
  const remaining = [...pool];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return result;
}

function weightedSample<T>(pool: T[], weights: number[], n: number): T[] {
  const rem = [...pool];
  const wts = [...weights];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const total = wts.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = wts.length - 1;
    for (let j = 0; j < wts.length; j++) { r -= wts[j]; if (r <= 0) { idx = j; break; } }
    result.push(rem[idx]);
    rem.splice(idx, 1);
    wts.splice(idx, 1);
  }
  return result;
}
