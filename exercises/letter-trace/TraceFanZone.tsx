import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CORRECT_BG, CORRECT_BORDER } from '../shared/tokens';
import type { CollectedDrawing } from './useRoundState';
import { DrawingCard } from './DrawingCard';

export const TRACE_CARD_SIZE  = 180;
export const TRACE_STACK_PEEK = 12;
export const TRACE_ROUNDS     = 5;

export function getTraceStackBase(canvasWidth: number): number {
  return (canvasWidth - TRACE_CARD_SIZE - (TRACE_ROUNDS - 1) * TRACE_STACK_PEEK) / 2;
}

interface Props {
  drawings:    CollectedDrawing[];
  canvasWidth: number;
}

export const TraceFanZone = React.forwardRef<View, Props>(
  function TraceFanZone({ drawings, canvasWidth }, ref) {
    const stackBase = getTraceStackBase(canvasWidth);

    return (
      <View
        ref={ref}
        style={[styles.zone, { width: canvasWidth, height: TRACE_CARD_SIZE + 16 }]}
      >
        {drawings.map((d, i) => (
          <View
            key={i}
            style={[styles.card, { left: stackBase + i * TRACE_STACK_PEEK, zIndex: i }]}
          >
            <DrawingCard drawing={d} size={TRACE_CARD_SIZE} />
          </View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  zone: { position: 'relative' },
  card: {
    position:        'absolute',
    top:             8,
    width:           TRACE_CARD_SIZE,
    height:          TRACE_CARD_SIZE,
    borderRadius:    12,
    backgroundColor: CORRECT_BG,
    borderWidth:     2,
    borderColor:     CORRECT_BORDER,
    overflow:        'hidden',
  },
});
