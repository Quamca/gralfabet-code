import { useState } from 'react';
import { View } from 'react-native';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { DOBRZE } from './audio-assets';
import { CONTAINER_PAD, FADE_OUT_MS, FAN_W, STACK_PEEK, TILE_W, TOTAL_ROUNDS, type Outcome, type RoundResult } from './gameUtils';

export interface FlyArgs {
  safeTopOffset: number;
  letter: string;
  outcome: Outcome;
  collected: string[];
  containerRef: React.RefObject<View | null>;
  tileRefs: React.MutableRefObject<Record<string, View | null>>;
  advance: () => void;
  cancel: () => void;
  playSequence: (sounds: number[]) => Promise<void>;
  updateLetter: (l: string, o: Outcome) => void;
  resultsRef: React.MutableRefObject<RoundResult[]>;
  setCollected: (c: string[]) => void;
}

export function useFlyAnimation() {
  const [flyingLetter, setFlyingLetter] = useState<string | null>(null);

  const flyX       = useSharedValue(0);
  const flyY       = useSharedValue(0);
  const flyOpacity = useSharedValue(0);
  const tilesOp    = useSharedValue(1);
  const hintOp     = useSharedValue(1);

  const flyStyle = useAnimatedStyle(() => ({
    left: flyX.value,
    top: flyY.value,
    opacity: flyOpacity.value,
  }));

  function resetWrongs() { tilesOp.value = 1; hintOp.value = 1; }

  function dropWrongs() { tilesOp.value = withTiming(0, { duration: 400 }); }

  function dropHint() { hintOp.value = withTiming(0, { duration: FADE_OUT_MS }); }

  function startFly({
    safeTopOffset, letter, outcome, collected, containerRef, tileRefs,
    advance, cancel, playSequence, updateLetter, resultsRef, setCollected,
  }: FlyArgs) {
    const newCollected = [...collected, letter];
    const idx       = collected.length;
    const stackBase = (FAN_W - TILE_W - (TOTAL_ROUNDS - 1) * STACK_PEEK) / 2;
    const targetX   = CONTAINER_PAD + stackBase + idx * STACK_PEEK;
    const targetY = safeTopOffset + CONTAINER_PAD + 8;

    containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
      tileRefs.current[letter]?.measure((_a, _b, _c, _d, tPx, tPy) => {
        flyX.value    = tPx - cPx;
        flyY.value    = tPy - cPy;
        flyOpacity.value = 1;
        setFlyingLetter(letter);

        flyX.value = withTiming(targetX, { duration: 350 });
        flyY.value = withTiming(targetY, { duration: 350 });

        dropWrongs();
        updateLetter(letter, outcome);
        resultsRef.current = [...resultsRef.current, { letter, outcome }];
        cancel();

        void playSequence([DOBRZE]).then(() => {
          setCollected(newCollected);
          flyOpacity.value = withTiming(0, { duration: 150 }, (done) => {
            if (done) {
              runOnJS(setFlyingLetter)(null);
              runOnJS(advance)();
            }
          });
        });
      });
    });
  }

  return { flyingLetter, flyStyle, tilesOp, hintOp, resetWrongs, dropWrongs, dropHint, startFly };
}
