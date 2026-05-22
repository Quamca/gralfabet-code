import { Dimensions } from 'react-native';
import { CONTAINER_PAD } from '../shared/tokens';
import { WORD_KEYS } from './word-data';
export { CONTAINER_PAD } from '../shared/tokens';
export type { Outcome, RoundResult } from '../shared/types';
export { TOTAL_ROUNDS, pickTiles } from '../shared/gameConstants';
export { HINT_DELAY_MS, REVEAL_STABLE_MS, FADE_OUT_MS } from '../shared/timings';
export { WORDS, WORD_KEYS } from './word-data';
export type { WordEntry } from './word-data';

export const { width: SCREEN_W } = Dimensions.get('window');
export const TILE_GAP   = 16;
export const TILE_W     = Math.floor((SCREEN_W - CONTAINER_PAD * 2 - TILE_GAP) / 2);
export const TILE_H     = 140;
export const IMAGE_SIZE = 100;
export const FAN_W      = SCREEN_W - CONTAINER_PAD * 2;
export const STACK_PEEK = 12;

export function selectGameLetters(count: number): string[] {
  const pool = [...WORD_KEYS];
  const result: string[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}
