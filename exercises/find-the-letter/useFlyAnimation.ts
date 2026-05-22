import { useState } from 'react';
import { View } from 'react-native';
import {
  runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { DOBRZE } from './audio-assets';
import { CONTAINER_PAD, FAN_W, TILE_W, type Outcome, type RoundResult } from './gameUtils';

export interface FlyArgs {
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
  const wrongsOp   = useSharedValue(1);

  const flyStyle = useAnimatedStyle(() => ({
    left: flyX.value,
    top: flyY.value,
    opacity: flyOpacity.value,
  }));

  const wrongStyle = useAnimatedStyle(() => ({
    opacity: wrongsOp.value,
  }));

  function resetWrongs() {
    wrongsOp.value = 1;
  }

  function dropWrongs() {
    wrongsOp.value = withTiming(0, { duration: 450 });
  }

  function startFly({
    letter, outcome, collected, containerRef, tileRefs,
    advance, cancel, playSequence, updateLetter, resultsRef, setCollected,
  }: FlyArgs) {
    const newCollected = [...collected, letter];
    const idx = collected.length;
    const n   = newCollected.length;
    const fanLeft = n <= 1 ? (FAN_W - TILE_W) / 2 : idx * (FAN_W - TILE_W) / (n - 1);
    const targetX = CONTAINER_PAD + fanLeft;
    const targetY = CONTAINER_PAD + 8;

    containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
      tileRefs.current[letter]?.measure((_a, _b, _c, _d, tPx, tPy) => {
        flyX.value    = tPx - cPx;
        flyY.value    = tPy - cPy;
        flyOpacity.value = 1;
        setFlyingLetter(letter);

        flyX.value = withSpring(targetX, { damping: 18, stiffness: 160 });
        flyY.value = withSpring(targetY, { damping: 18, stiffness: 160 });

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

  return { flyingLetter, flyStyle, wrongStyle, resetWrongs, dropWrongs, startFly };
}
