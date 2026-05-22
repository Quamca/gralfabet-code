import { useState } from 'react';
import { View } from 'react-native';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CONTAINER_PAD } from '../shared/tokens';
import { FADE_OUT_MS, FLY_DURATION_MS, FLY_FADE_MS, REVEAL_STABLE_MS } from '../shared/timings';
import { DOBRZE } from './audio-assets';
import { FAN_W, IMAGE_SIZE, STACK_PEEK, TOTAL_ROUNDS, type Outcome, type RoundResult } from './gameUtils';
import { type CollectedItem } from './ImageFanZone';
import { type WordEntry } from './word-data';

export interface FlyArgs {
  safeTopOffset: number;
  letter: string;
  currentEntry: WordEntry;
  outcome: Outcome;
  collected: CollectedItem[];
  containerRef: React.RefObject<View | null>;
  imageRef: React.RefObject<View | null>;
  advance: () => void;
  cancel: () => void;
  playSequence: (sounds: number[]) => Promise<void>;
  updateLetter: (l: string, o: Outcome) => void;
  resultsRef: React.MutableRefObject<RoundResult[]>;
  setCollected: React.Dispatch<React.SetStateAction<CollectedItem[]>>;
  setFilledLetter: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useFlyAnimation() {
  const [isFlyingImage, setIsFlyingImage] = useState(false);
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
    safeTopOffset, letter, currentEntry, outcome, collected, containerRef, imageRef,
    advance, cancel, playSequence, updateLetter, resultsRef, setCollected, setFilledLetter,
  }: FlyArgs) {
    const newItem: CollectedItem = { image: currentEntry.image, word: currentEntry.word };
    const idx       = collected.length;
    const stackBase = (FAN_W - IMAGE_SIZE - (TOTAL_ROUNDS - 1) * STACK_PEEK) / 2;
    const targetX   = CONTAINER_PAD + stackBase + idx * STACK_PEEK;
    const targetY   = safeTopOffset + CONTAINER_PAD + 8;

    setFilledLetter(letter);

    setTimeout(() => {
      containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
        imageRef.current?.measure((_a, _b, _c, _d, iPx, iPy) => {
          flyX.value = iPx - cPx;
          flyY.value = iPy - cPy;
          flyOpacity.value = 1;
          setIsFlyingImage(true);

          flyX.value = withTiming(targetX, { duration: FLY_DURATION_MS });
          flyY.value = withTiming(targetY, { duration: FLY_DURATION_MS });

          dropWrongs();
          updateLetter(letter, outcome);
          resultsRef.current = [...resultsRef.current, { letter, outcome }];
          cancel();

          const audios = [currentEntry.audioWord, DOBRZE].filter((a): a is number => a !== null);
          const afterPlay = audios.length > 0 ? playSequence(audios) : new Promise<void>((res) => setTimeout(res, FLY_DURATION_MS));
          void afterPlay.then(() => {
            setCollected((prev) => [...prev, newItem]);
            flyOpacity.value = withTiming(0, { duration: FLY_FADE_MS }, (done) => {
              if (done) {
                runOnJS(setIsFlyingImage)(false);
                runOnJS(advance)();
              }
            });
          });
        });
      });
    }, REVEAL_STABLE_MS);
  }

  return { isFlyingImage, flyStyle, tilesOp, hintOp, resetWrongs, dropWrongs, dropHint, startFly };
}
