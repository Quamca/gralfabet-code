import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { CONTAINER_PAD, CORRECT_BG, CORRECT_BORDER, SCREEN_BG } from '../shared/tokens';
import type { CollectedDrawing } from './useRoundState';
import { DrawingCard } from './DrawingCard';

const EXIT_ICON       = require('../../assets/images/shared/exit-button.png') as number;
const PLAY_AGAIN_ICON = require('../../assets/images/shared/play-again-button.png') as number;

const RESULT_CARD_SIZE = 140;

interface Props {
  drawings:    CollectedDrawing[];
  onPlayAgain: () => void;
  onExit:      () => void;
}

export function ResultScreen({ drawings, onPlayAgain, onExit }: Props): React.ReactElement {
  const hasDrawings = drawings.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Narysowane literki</Text>

        {hasDrawings ? (
          <View style={styles.grid}>
            {drawings.map((d, i) => (
              <Animated.View
                key={i}
                entering={ZoomIn.delay(i * 120)}
                style={styles.card}
              >
                <DrawingCard drawing={d} size={RESULT_CARD_SIZE} />
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7}>
              <Image source={PLAY_AGAIN_ICON} style={styles.btnIconLarge} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        {hasDrawings && (
          <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7}>
            <Image source={PLAY_AGAIN_ICON} style={styles.btnIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
          <Image source={EXIT_ICON} style={styles.btnIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: SCREEN_BG, padding: CONTAINER_PAD },
  content:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card:         { backgroundColor: CORRECT_BG, borderRadius: 16, borderWidth: 2, borderColor: CORRECT_BORDER },
  emptySection: { alignItems: 'center' },
  bottom:       { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 20 },
  btnIcon:      { width: 80, height: 80, resizeMode: 'contain' },
  btnIconLarge: { width: 112, height: 112, resizeMode: 'contain' },
});
