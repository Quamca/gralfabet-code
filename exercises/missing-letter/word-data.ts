import { WORD_IMAGES } from './image-assets';

const img = (word: string): number | null => WORD_IMAGES[word] ?? null;

export type WordEntry = {
  word: string;
  gapIndex: number;
  image: number | null;
};

export const WORDS: Record<string, WordEntry[]> = {
  a: [
    { word: 'auto',      gapIndex: 0, image: img('auto') },
    { word: 'arbuz',     gapIndex: 0, image: img('arbuz') },
    { word: 'aparat',    gapIndex: 0, image: img('aparat') },
  ],
  ą: [
    { word: 'ząb',       gapIndex: 1, image: img('ząb') },
    { word: 'wąs',       gapIndex: 1, image: img('wąs') },
    { word: 'bąk',       gapIndex: 1, image: img('bąk') },
  ],
  b: [
    { word: 'but',       gapIndex: 0, image: img('but') },
    { word: 'balon',     gapIndex: 0, image: img('balon') },
    { word: 'banan',     gapIndex: 0, image: img('banan') },
  ],
  c: [
    { word: 'cebula',    gapIndex: 0, image: img('cebula') },
    { word: 'cytryna',   gapIndex: 0, image: img('cytryna') },
    { word: 'cukierek',  gapIndex: 0, image: img('cukierek') },
  ],
  ć: [
    { word: 'ćma',       gapIndex: 0, image: img('ćma') },
    { word: 'ćwiek',     gapIndex: 0, image: img('ćwiek') },
  ],
  d: [
    { word: 'dom',       gapIndex: 0, image: img('dom') },
    { word: 'dym',       gapIndex: 0, image: img('dym') },
    { word: 'dynia',     gapIndex: 0, image: img('dynia') },
  ],
  e: [
    { word: 'ekran',     gapIndex: 0, image: img('ekran') },
    { word: 'elf',       gapIndex: 0, image: img('elf') },
    { word: 'emu',       gapIndex: 0, image: img('emu') },
  ],
  ę: [
    { word: 'ręka',      gapIndex: 1, image: img('ręka') },
    { word: 'gęś',       gapIndex: 1, image: img('gęś') },
    { word: 'pęk',       gapIndex: 1, image: img('pęk') },
  ],
  f: [
    { word: 'foka',      gapIndex: 0, image: img('foka') },
    { word: 'farba',     gapIndex: 0, image: img('farba') },
    { word: 'fotel',     gapIndex: 0, image: img('fotel') },
  ],
  g: [
    { word: 'góra',      gapIndex: 0, image: img('góra') },
    { word: 'garnek',    gapIndex: 0, image: img('garnek') },
    { word: 'gitara',    gapIndex: 0, image: img('gitara') },
  ],
  h: [
    { word: 'hamak',     gapIndex: 0, image: img('hamak') },
    { word: 'herbata',   gapIndex: 0, image: img('herbata') },
    { word: 'hulajnoga', gapIndex: 0, image: img('hulajnoga') },
  ],
  i: [
    { word: 'igła',      gapIndex: 0, image: img('igła') },
    { word: 'indyk',     gapIndex: 0, image: img('indyk') },
    { word: 'iskra',     gapIndex: 0, image: img('iskra') },
  ],
  j: [
    { word: 'jajko',     gapIndex: 0, image: img('jajko') },
    { word: 'jabłko',    gapIndex: 0, image: img('jabłko') },
    { word: 'jeż',       gapIndex: 0, image: img('jeż') },
  ],
  k: [
    { word: 'kot',       gapIndex: 0, image: img('kot') },
    { word: 'kura',      gapIndex: 0, image: img('kura') },
    { word: 'klocki',    gapIndex: 0, image: img('klocki') },
  ],
  l: [
    { word: 'lalka',     gapIndex: 0, image: img('lalka') },
    { word: 'lampa',     gapIndex: 0, image: img('lampa') },
    { word: 'lis',       gapIndex: 0, image: img('lis') },
  ],
  ł: [
    { word: 'łapa',      gapIndex: 0, image: img('łapa') },
    { word: 'łódka',     gapIndex: 0, image: img('łódka') },
    { word: 'łyżka',     gapIndex: 0, image: img('łyżka') },
  ],
  m: [
    { word: 'mama',      gapIndex: 0, image: img('mama') },
    { word: 'motyl',     gapIndex: 0, image: img('motyl') },
    { word: 'mleko',     gapIndex: 0, image: img('mleko') },
  ],
  n: [
    { word: 'nos',       gapIndex: 0, image: img('nos') },
    { word: 'narty',     gapIndex: 0, image: img('narty') },
    { word: 'nuta',      gapIndex: 0, image: img('nuta') },
  ],
  ń: [
    { word: 'koń',       gapIndex: 2, image: img('koń') },
    { word: 'słoń',      gapIndex: 3, image: img('słoń') },
    { word: 'dłoń',      gapIndex: 3, image: img('dłoń') },
  ],
  o: [
    { word: 'oko',       gapIndex: 0, image: img('oko') },
    { word: 'osa',       gapIndex: 0, image: img('osa') },
    { word: 'okno',      gapIndex: 0, image: img('okno') },
  ],
  ó: [
    { word: 'góra',      gapIndex: 1, image: img('góra') },
    { word: 'król',      gapIndex: 2, image: img('król') },
    { word: 'stół',      gapIndex: 2, image: img('stół') },
  ],
  p: [
    { word: 'pies',      gapIndex: 0, image: img('pies') },
    { word: 'piłka',     gapIndex: 0, image: img('piłka') },
    { word: 'parasol',   gapIndex: 0, image: img('parasol') },
  ],
  r: [
    { word: 'rak',       gapIndex: 0, image: img('rak') },
    { word: 'ryba',      gapIndex: 0, image: img('ryba') },
    { word: 'rower',     gapIndex: 0, image: img('rower') },
  ],
  s: [
    { word: 'sok',       gapIndex: 0, image: img('sok') },
    { word: 'sowa',      gapIndex: 0, image: img('sowa') },
    { word: 'ser',       gapIndex: 0, image: img('ser') },
  ],
  ś: [
    { word: 'ślimak',    gapIndex: 0, image: img('ślimak') },
    { word: 'świeca',    gapIndex: 0, image: img('świeca') },
    { word: 'śnieg',     gapIndex: 0, image: img('śnieg') },
  ],
  t: [
    { word: 'tort',      gapIndex: 0, image: img('tort') },
    { word: 'tata',      gapIndex: 0, image: img('tata') },
    { word: 'trawa',     gapIndex: 0, image: img('trawa') },
  ],
  u: [
    { word: 'ucho',      gapIndex: 0, image: img('ucho') },
    { word: 'ul',        gapIndex: 0, image: img('ul') },
    { word: 'usta',      gapIndex: 0, image: img('usta') },
  ],
  w: [
    { word: 'woda',      gapIndex: 0, image: img('woda') },
    { word: 'worek',     gapIndex: 0, image: img('worek') },
    { word: 'wilk',      gapIndex: 0, image: img('wilk') },
  ],
  y: [
    { word: 'byk',       gapIndex: 1, image: img('byk') },
    { word: 'dym',       gapIndex: 1, image: img('dym') },
    { word: 'mysz',      gapIndex: 1, image: img('mysz') },
  ],
  z: [
    { word: 'zamek',     gapIndex: 0, image: img('zamek') },
    { word: 'zebra',     gapIndex: 0, image: img('zebra') },
    { word: 'zupa',      gapIndex: 0, image: img('zupa') },
  ],
  ź: [
    { word: 'źrebak',    gapIndex: 0, image: img('źrebak') },
    { word: 'źródło',    gapIndex: 0, image: img('źródło') },
  ],
  ż: [
    { word: 'żaba',      gapIndex: 0, image: img('żaba') },
    { word: 'żółw',      gapIndex: 0, image: img('żółw') },
    { word: 'żyrafa',    gapIndex: 0, image: img('żyrafa') },
  ],
};

export const WORD_KEYS = Object.keys(WORDS);
