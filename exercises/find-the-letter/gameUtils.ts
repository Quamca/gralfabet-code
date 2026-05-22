import { Dimensions } from 'react-native';
import { LETTERS } from './audio-assets';
import { CONTAINER_PAD } from '../shared/tokens';
import { pickTiles as _pickTiles, TOTAL_ROUNDS as _TOTAL_ROUNDS } from '../shared/gameConstants';
import { HINT_DELAY_MS as _HINT, REVEAL_STABLE_MS as _REVEAL, FADE_OUT_MS as _FADE, FLY_DURATION_MS as _FLY, FLY_FADE_MS as _FLYFADE } from '../shared/timings';
export { CONTAINER_PAD } from '../shared/tokens';
export type { Outcome, RoundResult } from '../shared/types';
export { TOTAL_ROUNDS } from '../shared/gameConstants';
export { HINT_DELAY_MS, REVEAL_STABLE_MS, FADE_OUT_MS, FLY_DURATION_MS, FLY_FADE_MS } from '../shared/timings';

const ALL_LETTERS = Object.keys(LETTERS);

// suppress unused-import warnings — values re-exported above
void _TOTAL_ROUNDS; void _HINT; void _REVEAL; void _FADE; void _FLY; void _FLYFADE;

export const { width: SCREEN_W } = Dimensions.get('window');
export const TILE_GAP   = 16;
export const TILE_W     = Math.floor((SCREEN_W - CONTAINER_PAD * 2 - TILE_GAP) / 2);
export const TILE_H     = 140;
export const FAN_W      = SCREEN_W - CONTAINER_PAD * 2;
export const STACK_PEEK = 12;

export function pickTiles(target: string): string[] {
  return _pickTiles(target, ALL_LETTERS);
}
