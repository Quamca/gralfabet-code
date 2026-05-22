export type WordEntry = {
  word: string;
  gapIndex: number;
  image: number | null;
  audioInstruction: number | null;
  audioShort: number | null;
  audioWord: number | null;
};

// Add assets via require() once generated.
// Image files:  assets/images/missing-letter/{word}.png
// Audio files:  assets/sounds/missing-letter/{letter}-{word}-instruction.wav
//               assets/sounds/missing-letter/{letter}-{word}-short.wav
//               assets/sounds/missing-letter/{word}.wav

export const WORDS: Record<string, WordEntry[]> = {
  a: [{ word: 'auto',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  b: [{ word: 'balon',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  c: [{ word: 'cytryna',   gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  d: [{ word: 'dom',       gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  e: [{ word: 'ekran',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  f: [{ word: 'foka',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  g: [{ word: 'gitara',    gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  h: [{ word: 'hipopotam', gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  i: [{ word: 'igła',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  j: [{ word: 'jabłko',    gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  k: [{ word: 'kot',       gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  l: [{ word: 'lampa',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  ł: [{ word: 'łódka',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  m: [{ word: 'mama',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  n: [{ word: 'noga',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  o: [{ word: 'osa',       gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  p: [{ word: 'pies',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  r: [{ word: 'ryba',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  s: [{ word: 'słoń',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  t: [{ word: 'tęcza',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  u: [{ word: 'ucho',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  w: [{ word: 'woda',      gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  y: [{ word: 'byk',       gapIndex: 1, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
  z: [{ word: 'zegar',     gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null }],
};

export const WORD_KEYS = Object.keys(WORDS);
