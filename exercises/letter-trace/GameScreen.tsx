import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Canvas, Path as SkiaPath, Rect, Skia, useFont,
} from '@shopify/react-native-skia';
import { CONTAINER_PAD, CORRECT_BG, SCREEN_BG } from '../shared/tokens';
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
import { TraceFanZone, TRACE_CARD_SIZE, TRACE_ROUNDS } from './TraceFanZone';
import { DrawingCard } from './DrawingCard';
import { useFlyAnimation } from './useFlyAnimation';
import { ClearButton } from './ClearButton';

export type { RoundOutcome, CollectedDrawing };

const ROUNDS    = TRACE_ROUNDS;
const GLYPH_PAD = 16;
const EXIT_ICON = require('../../assets/images/shared/exit-button.png') as number;

interface Props {
  onComplete: (drawings: CollectedDrawing[]) => void;
  onExit:     () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { width }        = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();
  const canvasSize       = Math.round(width * 0.72);
  const fontSz           = Math.round(canvasSize * 0.82);

  const font = useFont(
    require('../../assets/fonts/PatrickHand-Regular.ttf'),
    fontSz,
  );

  const containerRef  = useRef<View>(null);
  const canvasViewRef = useRef<View>(null);
  const fanZoneRef    = useRef<View>(null);

  const [roundLetters] = useState(() => selectLetterEntries(ROUNDS));
  const [collectedDrawings, setCollectedDrawings] = useState<CollectedDrawing[]>([]);
  const [canvasVisible, setCanvasVisible] = useState(true);
  const collectedRef = useRef<CollectedDrawing[]>([]);

  const { playSequence, cancel } = useAudioSequence();

  const { flyDrawing, flyStyle, handleRoundSuccess } = useFlyAnimation({
    roundLetters, canvasSize, playSequence, collectedRef,
    setCollectedDrawings, setCanvasVisible, containerRef, canvasViewRef, fanZoneRef,
  });

  const { roundIndex, phase, renderTick,
          strokeRef, letterPathRef, letterGridRef,
          onBeginStroke, onPoint, onStrokeEnd, clearStroke } =
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

  useEffect(() => { setCanvasVisible(true); }, [roundIndex]);

  const currentEntry = roundLetters[roundIndex];

  const { letterX, letterY } = useMemo(() => {
    letterPathRef.current = null;
    letterGridRef.current = [];
    if (!font) return { letterX: canvasSize * 0.1, letterY: Math.round(canvasSize * 0.72) };
    const b        = font.measureText(currentEntry.letter);
    const minY     = Math.round(GLYPH_PAD - b.y);
    const maxY     = Math.round(canvasSize - GLYPH_PAD - (b.y + b.height));
    const lY       = Math.max(minY, Math.min(Math.max(minY, maxY), Math.round(canvasSize * 0.80)));
    const lx       = b.width > 0 ? canvasSize / 2 - b.x - b.width / 2 : canvasSize * 0.1;
    const path     = Skia.Path.MakeFromText(currentEntry.letter, lx, lY, font);
    letterPathRef.current = path;
    letterGridRef.current = path
      ? buildLetterGrid(
          (gx, gy) => path.contains(gx, gy),
          lx + b.x, lY + b.y, b.width, Math.abs(b.y) + b.height,
        )
      : [];
    return { letterX: lx, letterY: lY };
  }, [font, currentEntry.letter, canvasSize, letterPathRef, letterGridRef]);

  const gesture = Gesture.Pan()
    .onBegin((e) => { runOnJS(onBeginStroke)(e.x, e.y); })
    .onUpdate((e) => { runOnJS(onPoint)(e.x, e.y); })
    .onFinalize(() => { runOnJS(onStrokeEnd)(); });

  const strokePath = useMemo(() => {
    const pts = strokeRef.current;
    if (pts.length === 0) return null;
    const p = Skia.Path.Make();
    const segs: StrokePoint[][] = [];
    let cur: StrokePoint[] = [];
    for (const pt of pts) {
      if (pt.newStroke && cur.length > 0) { segs.push(cur); cur = []; }
      cur.push(pt);
    }
    if (cur.length > 0) segs.push(cur);
    for (const seg of segs) {
      if (seg.length === 1) { p.addCircle(seg[0].x, seg[0].y, 11); }
      else { p.moveTo(seg[0].x, seg[0].y); for (let i = 1; i < seg.length; i++) p.lineTo(seg[i].x, seg[i].y); }
    }
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTick]);

  const strokeColor = phaseToStrokeColor(phase);
  const clearActive = (phase === 'idle' || phase === 'drawing') && strokeRef.current.length > 0;
  const isSuccess   = phase === 'success';

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={{ paddingTop: safeTop + CONTAINER_PAD }}>
        <TraceFanZone ref={fanZoneRef} drawings={collectedDrawings} canvasWidth={canvasSize} />
      </View>

      <View style={styles.canvasArea}>
        <ClearButton onPress={clearStroke} active={clearActive} />
        <View style={{ opacity: canvasVisible ? 1 : 0 }}>
        <GestureDetector gesture={gesture}>
          <View ref={canvasViewRef} style={[styles.canvasBorder, isSuccess && styles.canvasBorderSuccess]}>
            <Canvas style={{ width: canvasSize, height: canvasSize }}>
              {isSuccess && (
                <Rect x={0} y={0} width={canvasSize} height={canvasSize} color={CORRECT_BG} />
              )}
              {font && letterPathRef.current && (
                <>
                  <SkiaPath
                    path={letterPathRef.current}
                    style="stroke"
                    strokeWidth={20}
                    strokeCap="round"
                    strokeJoin="round"
                    color={isSuccess ? '#43A047' : '#2C3E50'}
                  />
                  <SkiaPath
                    path={letterPathRef.current}
                    style="fill"
                    color={isSuccess ? '#43A047' : '#2C3E50'}
                  />
                </>
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
  container:          { flex: 1, backgroundColor: 'transparent', alignItems: 'center' },
  canvasArea:         { flex: 1, justifyContent: 'flex-end', marginBottom: 24 },
  canvasBorder:       { borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  canvasBorderSuccess: {
    borderWidth:  3,
    borderColor:  '#43A047',
    borderRadius: 12,
    overflow:     'hidden',
  },
  bottom:    { paddingBottom: 20, paddingTop: 8 },
  exitIcon:  { width: 80, height: 80, resizeMode: 'contain' },
  flyCard: {
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
