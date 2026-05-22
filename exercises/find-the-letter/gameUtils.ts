import { Dimensions } from 'react-native';
import { LETTERS } from './audio-assets';

const ALL_LETTERS = Object.keys(LETTERS);

export const { width: SCREEN_W } = Dimensions.get('window');
export const CONTAINER_PAD = 24;
export const TILE_GAP      = 16;
export const TILE_W        = Math.floor((SCREEN_W - CONTAINER_PAD * 2 - TILE_GAP) / 2);
export const TILE_H        = 140;
export const FAN_W         = SCREEN_W - CONTAINER_PAD * 2;
export const TOTAL_ROUNDS  = 5;
export const HINT_DELAY_MS    = 1500;
export const STACK_PEEK       = 12;
export const REVEAL_STABLE_MS = 350;
export const FADE_OUT_MS      = 300;

export type Outcome     = 'first-try' | 'second-try' | 'auto-reveal';
export type RoundResult = { letter: string; outcome: Outcome };

export function pickTiles(target: string): string[] {
  const pool = ALL_LETTERS.filter((l) => l !== target);
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!distractors.includes(pool[idx])) distractors.push(pool[idx]);
  }
  const tiles = [target, ...distractors];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}
