import { useCallback, useState } from 'react';
import type { View } from 'react-native';
import {
  runOnJS, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { FLY_DURATION_MS, FLY_FADE_MS, SUCCESS_GREEN_HOLD_MS } from '../shared/timings';
import type { LetterEntry } from './letter-data';
import {
  TRACE_CARD_SIZE, TRACE_STACK_PEEK, getTraceStackBase,
} from './TraceFanZone';
import type { CollectedDrawing, StrokePoint } from './useRoundState';

const DOBRZE = require('../../assets/sounds/shared/phrases/dobrze.mp3') as number;

interface Options {
  roundLetters:         LetterEntry[];
  canvasSize:           number;
  playSequence:         (audio: number[]) => void;
  collectedRef:         { current: CollectedDrawing[] };
  setCollectedDrawings: (drawings: CollectedDrawing[]) => void;
  setCanvasVisible:     (visible: boolean) => void;
  containerRef:         { current: View | null };
  canvasViewRef:        { current: View | null };
  fanZoneRef:           { current: View | null };
}

export function useFlyAnimation({
  roundLetters, canvasSize, playSequence, collectedRef,
  setCollectedDrawings, setCanvasVisible, containerRef, canvasViewRef, fanZoneRef,
}: Options) {
  const [flyDrawing, setFlyDrawing] = useState<CollectedDrawing | null>(null);

  const flyX       = useSharedValue(0);
  const flyY       = useSharedValue(0);
  const flyOpacity = useSharedValue(0);
  const flyScale   = useSharedValue(1);

  const flyStyle = useAnimatedStyle(() => ({
    left:      flyX.value,
    top:       flyY.value,
    opacity:   flyOpacity.value,
    transform: [{ scale: flyScale.value }],
  }));

  const handleRoundSuccess = useCallback((
    roundIdx: number,
    points:   ReadonlyArray<StrokePoint>,
  ) => {
    const entry      = roundLetters[roundIdx];
    const drawing: CollectedDrawing = { letter: entry.letter, strokePoints: points, canvasSize };
    const newCollected = [...collectedRef.current, drawing];
    const idx          = newCollected.length - 1;
    collectedRef.current = newCollected;
    setFlyDrawing(drawing);
    void playSequence([DOBRZE]);

    const stackBase = getTraceStackBase(canvasSize);

    setTimeout(() => {
      setCanvasVisible(false);
      containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
        canvasViewRef.current?.measure((_a, _b, _c, _d, vPx, vPy) => {
          fanZoneRef.current?.measure((_a, _b, _c, _d, fPx, fPy) => {
            flyScale.value   = canvasSize / TRACE_CARD_SIZE;
            flyX.value       = vPx - cPx + canvasSize / 2 - TRACE_CARD_SIZE / 2;
            flyY.value       = vPy - cPy + canvasSize / 2 - TRACE_CARD_SIZE / 2;
            flyOpacity.value = 1;

            flyX.value     = withTiming(fPx - cPx + stackBase + idx * TRACE_STACK_PEEK, { duration: FLY_DURATION_MS });
            flyY.value     = withTiming(fPy - cPy + 8,                                  { duration: FLY_DURATION_MS });
            flyScale.value = withTiming(1,                                               { duration: FLY_DURATION_MS });

            setTimeout(() => {
              setCollectedDrawings(newCollected);
              flyOpacity.value = withTiming(0, { duration: FLY_FADE_MS }, (done) => {
                if (done) runOnJS(setFlyDrawing)(null);
              });
            }, FLY_DURATION_MS);
          });
        });
      });
    }, SUCCESS_GREEN_HOLD_MS);
  }, [roundLetters, canvasSize, playSequence, collectedRef, setCollectedDrawings,
      setCanvasVisible, containerRef, canvasViewRef, fanZoneRef, flyX, flyY, flyOpacity, flyScale]);

  return { flyDrawing, flyStyle, handleRoundSuccess };
}
