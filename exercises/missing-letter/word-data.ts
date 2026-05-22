export type WordEntry = {
  word: string;
  gapIndex: number;
  image: number | null;
};

export const WORDS: Record<string, WordEntry[]> = {
  a: [
    { word: 'auto',      gapIndex: 0, image: null },
    { word: 'arbuz',     gapIndex: 0, image: null },
    { word: 'aparat',    gapIndex: 0, image: null },
  ],
  ą: [
    { word: 'ząb',       gapIndex: 1, image: null },
    { word: 'wąs',       gapIndex: 1, image: null },
    { word: 'bąk',       gapIndex: 1, image: null },
  ],
  b: [
    { word: 'but',       gapIndex: 0, image: null },
    { word: 'balon',     gapIndex: 0, image: null },
    { word: 'banan',     gapIndex: 0, image: null },
  ],
  c: [
    { word: 'cebula',    gapIndex: 0, image: null },
    { word: 'cytryna',   gapIndex: 0, image: null },
    { word: 'cukierek',  gapIndex: 0, image: null },
  ],
  ć: [
    { word: 'ćma',       gapIndex: 0, image: null },
    { word: 'ćwiek',     gapIndex: 0, image: null },
  ],
  d: [
    { word: 'dom',       gapIndex: 0, image: null },
    { word: 'dym',       gapIndex: 0, image: null },
    { word: 'dynia',     gapIndex: 0, image: null },
  ],
  e: [
    { word: 'ekran',     gapIndex: 0, image: null },
    { word: 'elf',       gapIndex: 0, image: null },
    { word: 'emu',       gapIndex: 0, image: null },
  ],
  ę: [
    { word: 'ręka',      gapIndex: 1, image: null },
    { word: 'gęś',       gapIndex: 1, image: null },
    { word: 'pęk',       gapIndex: 1, image: null },
  ],
  f: [
    { word: 'foka',      gapIndex: 0, image: null },
    { word: 'farba',     gapIndex: 0, image: null },
    { word: 'fotel',     gapIndex: 0, image: null },
  ],
  g: [
    { word: 'góra',      gapIndex: 0, image: null },
    { word: 'garnek',    gapIndex: 0, image: null },
    { word: 'gitara',    gapIndex: 0, image: null },
  ],
  h: [
    { word: 'hamak',     gapIndex: 0, image: null },
    { word: 'herbata',   gapIndex: 0, image: null },
    { word: 'hulajnoga', gapIndex: 0, image: null },
  ],
  i: [
    { word: 'igła',      gapIndex: 0, image: null },
    { word: 'indyk',     gapIndex: 0, image: null },
    { word: 'iskra',     gapIndex: 0, image: null },
  ],
  j: [
    { word: 'jajko',     gapIndex: 0, image: null },
    { word: 'jabłko',    gapIndex: 0, image: null },
    { word: 'jeż',       gapIndex: 0, image: null },
  ],
  k: [
    { word: 'kot',       gapIndex: 0, image: null },
    { word: 'kura',      gapIndex: 0, image: null },
    { word: 'klocki',    gapIndex: 0, image: null },
  ],
  l: [
    { word: 'lalka',     gapIndex: 0, image: null },
    { word: 'lampa',     gapIndex: 0, image: null },
    { word: 'lis',       gapIndex: 0, image: null },
  ],
  ł: [
    { word: 'łapa',      gapIndex: 0, image: null },
    { word: 'łódka',     gapIndex: 0, image: null },
    { word: 'łyżka',     gapIndex: 0, image: null },
  ],
  m: [
    { word: 'mama',      gapIndex: 0, image: null },
    { word: 'motyl',     gapIndex: 0, image: null },
    { word: 'mleko',     gapIndex: 0, image: null },
  ],
  n: [
    { word: 'nos',       gapIndex: 0, image: null },
    { word: 'narty',     gapIndex: 0, image: null },
    { word: 'nuta',      gapIndex: 0, image: null },
  ],
  ń: [
    { word: 'koń',       gapIndex: 2, image: null },
    { word: 'słoń',      gapIndex: 3, image: null },
    { word: 'dłoń',      gapIndex: 3, image: null },
  ],
  o: [
    { word: 'oko',       gapIndex: 0, image: null },
    { word: 'osa',       gapIndex: 0, image: null },
    { word: 'okno',      gapIndex: 0, image: null },
  ],
  ó: [
    { word: 'góra',      gapIndex: 1, image: null },
    { word: 'król',      gapIndex: 2, image: null },
    { word: 'stół',      gapIndex: 2, image: null },
  ],
  p: [
    { word: 'pies',      gapIndex: 0, image: null },
    { word: 'piłka',     gapIndex: 0, image: null },
    { word: 'parasol',   gapIndex: 0, image: null },
  ],
  r: [
    { word: 'rak',       gapIndex: 0, image: null },
    { word: 'ryba',      gapIndex: 0, image: null },
    { word: 'rower',     gapIndex: 0, image: null },
  ],
  s: [
    { word: 'sok',       gapIndex: 0, image: null },
    { word: 'sowa',      gapIndex: 0, image: null },
    { word: 'ser',       gapIndex: 0, image: null },
  ],
  ś: [
    { word: 'ślimak',    gapIndex: 0, image: null },
    { word: 'świeca',    gapIndex: 0, image: null },
    { word: 'śnieg',     gapIndex: 0, image: null },
  ],
  t: [
    { word: 'tort',      gapIndex: 0, image: null },
    { word: 'tata',      gapIndex: 0, image: null },
    { word: 'trawa',     gapIndex: 0, image: null },
  ],
  u: [
    { word: 'ucho',      gapIndex: 0, image: null },
    { word: 'ul',        gapIndex: 0, image: null },
    { word: 'usta',      gapIndex: 0, image: null },
  ],
  w: [
    { word: 'woda',      gapIndex: 0, image: null },
    { word: 'worek',     gapIndex: 0, image: null },
    { word: 'wilk',      gapIndex: 0, image: null },
  ],
  y: [
    { word: 'byk',       gapIndex: 1, image: null },
    { word: 'dym',       gapIndex: 1, image: null },
    { word: 'mysz',      gapIndex: 1, image: null },
  ],
  z: [
    { word: 'zamek',     gapIndex: 0, image: null },
    { word: 'zebra',     gapIndex: 0, image: null },
    { word: 'zupa',      gapIndex: 0, image: null },
  ],
  ź: [
    { word: 'źrebak',    gapIndex: 0, image: null },
    { word: 'źródło',    gapIndex: 0, image: null },
  ],
  ż: [
    { word: 'żaba',      gapIndex: 0, image: null },
    { word: 'żółw',      gapIndex: 0, image: null },
    { word: 'żyrafa',    gapIndex: 0, image: null },
  ],
};

export const WORD_KEYS = Object.keys(WORDS);
