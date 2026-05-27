import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { CONTAINER_PAD, CORRECT_BG, CORRECT_BORDER, SCREEN_BG } from '../shared/tokens';
import { type RoundResult } from './gameUtils';

const EXIT_ICON       = require('../../assets/images/shared/exit-button.png');
const PLAY_AGAIN_ICON = require('../../assets/images/shared/play-again-button.png');
const EMPTY_STATE     = require('../../assets/images/shared/empty-state.png');

interface Props {
  results: RoundResult[];
  onPlayAgain: () => void;
  onExit: () => void;
}

export function ResultScreen({ results, onPlayAgain, onExit }: Props): React.ReactElement {
  const collected = results.filter((r) => r.outcome !== 'auto-reveal');
  const hasCollected = collected.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Zebrane litery</Text>

        {hasCollected ? (
          <View style={styles.grid}>
            {collected.map(({ letter }, i) => (
              <Animated.View
                key={letter}
                entering={ZoomIn.delay(i * 120)}
                style={styles.card}
              >
                <Text style={styles.cardUpper}>{letter.toUpperCase()}</Text>
                <Text style={styles.cardLower}>{letter}</Text>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Image source={EMPTY_STATE} style={styles.emptyImage} />
            <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7}>
              <Image source={PLAY_AGAIN_ICON} style={styles.btnIconLarge} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        {hasCollected && (
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
  container:    { flex: 1, backgroundColor: 'transparent', padding: CONTAINER_PAD },
  content:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card:         { backgroundColor: CORRECT_BG, borderRadius: 16, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', borderWidth: 2, borderColor: CORRECT_BORDER, minWidth: '42%' },
  cardUpper:    { fontSize: 48, fontWeight: 'bold', color: '#333' },
  cardLower:    { fontSize: 24, color: '#666', marginTop: 4 },
  emptySection: { alignItems: 'center', gap: 24 },
  emptyImage:   { width: 200, height: 200, resizeMode: 'contain' },
  bottom:       { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 20 },
  btnIcon:      { width: 80, height: 80, resizeMode: 'contain' },
  btnIconLarge: { width: 112, height: 112, resizeMode: 'contain' },
});
