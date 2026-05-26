import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Canvas,
  Circle,
  Path as SkiaPath,
  Skia,
  Text as SkiaText,
  matchFont,
} from '@shopify/react-native-skia';
import { SCREEN_BG } from '../shared/tokens';
import { selectLetterEntries } from './letter-data';
import { getPromptAudio } from './audio-assets';
import { buildLetterGrid } from './letter-trace-utils';
import { useRoundState, type Phase, type RoundOutcome } from './useRoundState';
import { useAudioSequence } from '../../hooks/useAudioSequence';

export type { RoundOutcome };

const ROUNDS_PER_SESSION = 5;
const LETTER_FONT_SIZE   = 200;
const START_POINT_RADIUS = 14;

interface Props {
  onComplete: (outcomes: RoundOutcome[]) => void;
  onExit:     () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { width, height } = useWindowDimensions();
  const canvasSize        = Math.min(width, height) * 0.75;
  const letterY           = canvasSize * 0.78;

  const font = useMemo(
    () => matchFont({ fontFamily: 'sans-serif', fontSize: LETTER_FONT_SIZE }),
    []
  );

  const [roundLetters] = React.useState(() => selectLetterEntries(ROUNDS_PER_SESSION));
  const { roundIndex, phase, failCount, renderTick, strokeRef,
          letterPathRef, letterGridRef, onPoint, onStrokeEnd } = useRoundState(onComplete);

  const { playSequence, cancel } = useAudioSequence();
  const pulseRadius = useSharedValue(START_POINT_RADIUS);

  useEffect(() => {
    const entry = roundLetters[roundIndex];
    void playSequence([getPromptAudio(entry)]);
    return () => { cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex]);

  useEffect(() => {
    if (phase === 'idle') {
      pulseRadius.value = withRepeat(
        withSequence(
          withTiming(START_POINT_RADIUS + 6, { duration: 600 }),
          withTiming(START_POINT_RADIUS,     { duration: 600 }),
        ),
        -1,
      );
    } else {
      pulseRadius.value = withTiming(START_POINT_RADIUS, { duration: 100 });
    }
  }, [phase, pulseRadius]);

  const currentEntry = roundLetters[roundIndex];

  const { letterX, startPoint } = useMemo(() => {
    letterPathRef.current = null;
    letterGridRef.current = [];
    if (!font) {
      return {
        letterX:    canvasSize * 0.1,
        startPoint: { x: canvasSize * 0.2, y: letterY - LETTER_FONT_SIZE * 0.8 },
      };
    }
    const b    = font.measureText(currentEntry.letter);
    const lx   = b.width > 0 ? canvasSize / 2 - b.x - b.width / 2 : canvasSize * 0.1;
    const path = Skia.Path.MakeFromText(currentEntry.letter, lx, letterY, font);
    letterPathRef.current = path;
    letterGridRef.current = path
      ? buildLetterGrid(
          (gx, gy) => path.contains(gx, gy),
          lx + b.x,
          letterY + b.y,
          b.width,
          Math.abs(b.y) + b.height,
        )
      : [];
    return {
      letterX:    lx,
      startPoint: {
        x: lx + (b.width > 0 ? b.x + b.width * 0.2 : LETTER_FONT_SIZE * 0.1),
        y: letterY - LETTER_FONT_SIZE * 0.8,
      },
    };
  }, [font, currentEntry.letter, canvasSize, letterY, letterPathRef, letterGridRef]);

  const gesture = Gesture.Pan()
    .onBegin((e) => { runOnJS(onPoint)(e.x, e.y); })
    .onUpdate((e) => { runOnJS(onPoint)(e.x, e.y); })
    .onEnd(()    => { runOnJS(onStrokeEnd)(); });

  const strokePath = useMemo(() => {
    const pts = strokeRef.current;
    if (pts.length < 2) return null;
    const p = Skia.Path.Make();
    p.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i].x, pts[i].y);
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTick]);

  const strokeColor = phaseToStrokeColor(phase);
  const feedbackMsg = phaseToFeedback(phase, failCount);

  return (
    <View style={styles.container}>
      <Text style={styles.round}>
        Litera {roundIndex + 1} / {ROUNDS_PER_SESSION}
        {failCount > 0 && phase === 'idle' ? `  (próba ${failCount + 1}/2)` : ''}
      </Text>
      {feedbackMsg ? <Text style={styles.feedback}>{feedbackMsg}</Text> : null}
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width: canvasSize, height: canvasSize }}>
          {font ? (
            <SkiaText
              text={currentEntry.letter}
              x={letterX}
              y={letterY}
              font={font}
              color={phase === 'success' ? '#43A047' : '#2C3E50'}
            />
          ) : null}
          {strokePath ? (
            <SkiaPath
              path={strokePath}
              color={strokeColor}
              style="stroke"
              strokeWidth={16}
              strokeCap="round"
              strokeJoin="round"
            />
          ) : null}
          <Circle
            cx={startPoint.x}
            cy={startPoint.y}
            r={pulseRadius}
            color={phase === 'idle' ? '#E74C3C' : 'transparent'}
          />
        </Canvas>
      </GestureDetector>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7} style={styles.exitBtn}>
          <Text style={styles.exitText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function phaseToStrokeColor(phase: Phase): string {
  if (phase === 'success')  return '#43A047';
  if (phase === 'revealed') return '#90A4AE';
  return '#2196F3';
}

function phaseToFeedback(phase: Phase, failCount: number): string {
  if (phase === 'success')  return 'Świetnie!';
  if (phase === 'revealed') return 'Spróbuj następną!';
  if (failCount > 0)        return 'Spróbuj jeszcze raz!';
  return '';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SCREEN_BG, alignItems: 'center', justifyContent: 'center', padding: 20 },
  round:     { fontSize: 20, color: '#666', marginBottom: 4 },
  feedback:  { fontSize: 18, color: '#E57373', marginBottom: 8, fontWeight: 'bold' },
  buttons:   { marginTop: 24 },
  exitBtn:   { backgroundColor: '#90A4AE', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  exitText:  { fontSize: 18, color: '#fff' },
});
