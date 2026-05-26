import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Canvas, Path as SkiaPath, Rect, Skia,
  Text as SkiaText, matchFont,
} from '@shopify/react-native-skia';
import { CONTAINER_PAD, CORRECT_BG, SCREEN_BG } from '../shared/tokens';
import { FLY_DURATION_MS, FLY_FADE_MS } from '../shared/timings';
import { selectLetterEntries } from './letter-data';
import { getPromptAudio, TRY_AGAIN } from './audio-assets';
import { buildLetterGrid } from './letter-trace-utils';
import {
  useRoundState,
  type CollectedDrawing,
  type Phase,
  type RoundOutcome,
  type StrokePoint,
} from './useRoundState';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import {
  TraceFanZone,
  TRACE_CARD_SIZE,
  TRACE_STACK_PEEK,
  TRACE_ROUNDS,
  getTraceStackBase,
} from './TraceFanZone';
import { DrawingCard } from './DrawingCard';

export type { RoundOutcome, CollectedDrawing };

const ROUNDS    = TRACE_ROUNDS;
const EXIT_ICON = require('../../assets/images/shared/exit-button.png') as number;
const DOBRZE    = require('../../assets/sounds/shared/phrases/dobrze.mp3') as number;

interface Props {
  onComplete: (drawings: CollectedDrawing[]) => void;
  onExit:     () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { width }        = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();
  const canvasSize       = Math.round(width * 0.92);
  const fontSz           = Math.round(canvasSize * 0.75);
  const letterY          = Math.round(canvasSize * 0.88);

  const font = useMemo(() => matchFont({ fontFamily: 'sans-serif', fontSize: fontSz, fontWeight: 'bold' }), [fontSz]);

  const containerRef  = useRef<View>(null);
  const canvasViewRef = useRef<View>(null);
  const fanZoneRef    = useRef<View>(null);

  const [roundLetters]     = useState(() => selectLetterEntries(ROUNDS));
  const [collectedDrawings, setCollectedDrawings] = useState<CollectedDrawing[]>([]);
  const [flyDrawing,        setFlyDrawing]        = useState<CollectedDrawing | null>(null);
  const collectedRef = useRef<CollectedDrawing[]>([]);

  const flyX       = useSharedValue(0);
  const flyY       = useSharedValue(0);
  const flyOpacity = useSharedValue(0);
  const flyStyle   = useAnimatedStyle(() => ({
    left: flyX.value, top: flyY.value, opacity: flyOpacity.value,
  }));

  const { playSequence, cancel } = useAudioSequence();

  const handleRoundSuccess = useCallback((
    roundIdx: number,
    points:   ReadonlyArray<StrokePoint>,
  ) => {
    const entry    = roundLetters[roundIdx];
    const drawing: CollectedDrawing = { letter: entry.letter, strokePoints: points, canvasSize };
    const idx      = collectedRef.current.length;
    collectedRef.current = [...collectedRef.current, drawing];
    setCollectedDrawings([...collectedRef.current]);
    setFlyDrawing(drawing);
    void playSequence([DOBRZE]);

    const stackBase = getTraceStackBase(canvasSize);

    setTimeout(() => {
      containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
        canvasViewRef.current?.measure((_a, _b, _c, _d, vPx, vPy) => {
          fanZoneRef.current?.measure((_a, _b, _c, _d, fPx, fPy) => {
            flyX.value       = vPx - cPx + canvasSize / 2 - TRACE_CARD_SIZE / 2;
            flyY.value       = vPy - cPy + canvasSize / 2 - TRACE_CARD_SIZE / 2;
            flyOpacity.value = 1;

            flyX.value = withTiming(fPx - cPx + stackBase + idx * TRACE_STACK_PEEK, { duration: FLY_DURATION_MS });
            flyY.value = withTiming(fPy - cPy + 8,                                  { duration: FLY_DURATION_MS });

            setTimeout(() => {
              flyOpacity.value = withTiming(0, { duration: FLY_FADE_MS }, (done) => {
                if (done) runOnJS(setFlyDrawing)(null);
              });
            }, FLY_DURATION_MS);
          });
        });
      });
    }, 100);
  }, [roundLetters, canvasSize, playSequence, flyX, flyY, flyOpacity]);

  const { roundIndex, phase, renderTick,
          strokeRef, letterPathRef, letterGridRef, onBeginStroke, onPoint, onStrokeEnd } =
    useRoundState(
      (_outcomes) => onComplete(collectedRef.current),
      {
        onRoundSuccess: handleRoundSuccess,
        onFail: () => { void playSequence([TRY_AGAIN]); },
      },
    );

  useEffect(() => {
    const entry = roundLetters[roundIndex];
    void playSequence([getPromptAudio(entry)]);
    return () => { cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex]);

  const currentEntry = roundLetters[roundIndex];

  const { letterX } = useMemo(() => {
    letterPathRef.current = null;
    letterGridRef.current = [];
    if (!font) return { letterX: canvasSize * 0.1 };
    const b    = font.measureText(currentEntry.letter);
    const lx   = b.width > 0 ? canvasSize / 2 - b.x - b.width / 2 : canvasSize * 0.1;
    const path = Skia.Path.MakeFromText(currentEntry.letter, lx, letterY, font);
    letterPathRef.current = path;
    letterGridRef.current = path
      ? buildLetterGrid(
          (gx, gy) => path.contains(gx, gy),
          lx + b.x, letterY + b.y, b.width, Math.abs(b.y) + b.height,
        )
      : [];
    return { letterX: lx };
  }, [font, currentEntry.letter, canvasSize, letterY, letterPathRef, letterGridRef]);

  const gesture = Gesture.Pan()
    .onBegin((e) => { runOnJS(onBeginStroke)(e.x, e.y); })
    .onUpdate((e) => { runOnJS(onPoint)(e.x, e.y); })
    .onEnd(()    => { runOnJS(onStrokeEnd)(); });

  const strokePath = useMemo(() => {
    const pts = strokeRef.current;
    if (pts.length < 2) return null;
    const p = Skia.Path.Make();
    let started = false;
    for (const pt of pts) {
      if (pt.newStroke || !started) {
        p.moveTo(pt.x, pt.y);
        started = true;
      } else {
        p.lineTo(pt.x, pt.y);
      }
    }
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTick]);

  const strokeColor = phaseToStrokeColor(phase);

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={{ paddingTop: safeTop + 4 }}>
        <TraceFanZone
          ref={fanZoneRef}
          drawings={collectedDrawings}
          canvasWidth={canvasSize}
        />
      </View>

      <View style={styles.canvasArea}>
        <GestureDetector gesture={gesture}>
          <View ref={canvasViewRef} style={styles.canvasBorder}>
            <Canvas style={{ width: canvasSize, height: canvasSize }}>
              {phase === 'success' && (
                <Rect x={0} y={0} width={canvasSize} height={canvasSize} color={CORRECT_BG} />
              )}
              {font && (
                <SkiaText
                  text={currentEntry.letter}
                  x={letterX}
                  y={letterY}
                  font={font}
                  color={phase === 'success' ? '#43A047' : '#2C3E50'}
                />
              )}
              {strokePath && (
                <SkiaPath
                  path={strokePath}
                  color={strokeColor}
                  style="stroke"
                  strokeWidth={22}
                  strokeCap="round"
                  strokeJoin="round"
                />
              )}
            </Canvas>
          </View>
        </GestureDetector>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
          <Image source={EXIT_ICON} style={styles.exitIcon} />
        </TouchableOpacity>
      </View>

      {flyDrawing !== null && (
        <Animated.View style={[styles.flyCard, flyStyle]} pointerEvents="none">
          <DrawingCard drawing={flyDrawing} size={TRACE_CARD_SIZE} />
        </Animated.View>
      )}
    </View>
  );
}

function phaseToStrokeColor(phase: Phase): string {
  if (phase === 'success')  return '#43A047';
  if (phase === 'revealed') return '#90A4AE';
  return '#2196F3';
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: SCREEN_BG, alignItems: 'center' },
  canvasArea:   { flex: 1, justifyContent: 'center' },
  canvasBorder: { borderWidth: 1, borderColor: '#ccc' },
  bottom:       { paddingBottom: 20, paddingTop: 8 },
  exitIcon:     { width: 80, height: 80, resizeMode: 'contain' },
  flyCard:   {
    position:        'absolute',
    width:           TRACE_CARD_SIZE,
    height:          TRACE_CARD_SIZE,
    borderRadius:    12,
    overflow:        'hidden',
    backgroundColor: CORRECT_BG,
    borderWidth:     2,
    borderColor:     '#43A047',
    zIndex:          999,
  },
});
