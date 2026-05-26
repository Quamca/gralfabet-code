import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { CONTAINER_PAD, CORRECT_BG, CORRECT_BORDER, SCREEN_BG } from '../shared/tokens';
import { type CollectedItem } from './ImageFanZone';

const EXIT_ICON       = require('../../assets/images/shared/exit-button.png');
const PLAY_AGAIN_ICON = require('../../assets/images/shared/play-again-button.png');

interface Props {
  collected: CollectedItem[];
  onPlayAgain: () => void;
  onExit: () => void;
}

export function ResultScreen({ collected, onPlayAgain, onExit }: Props): React.ReactElement {
  const hasCollected = collected.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Zdobyte obrazki</Text>
        {hasCollected ? (
          <View style={styles.grid}>
            {collected.map((item, i) => (
              <Animated.View key={item.word + i} entering={ZoomIn.delay(i * 120)} style={styles.card}>
                {item.image
                  ? <Image source={item.image} style={styles.cardImg} />
                  : <View style={styles.placeholder} />}
                <Text style={styles.label}>{item.word}</Text>
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
  container:    { flex: 1, backgroundColor: SCREEN_BG, padding: CONTAINER_PAD },
  content:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card:         { backgroundColor: CORRECT_BG, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16, alignItems: 'center', borderWidth: 2, borderColor: CORRECT_BORDER, minWidth: '42%' },
  cardImg:      { width: 140, height: 140, resizeMode: 'contain' },
  placeholder:  { width: 140, height: 140, backgroundColor: '#B0BEC5', borderRadius: 8 },
  label:        { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 10 },
  emptySection: { alignItems: 'center' },
  bottom:       { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 20 },
  btnIcon:      { width: 80, height: 80, resizeMode: 'contain' },
  btnIconLarge: { width: 112, height: 112, resizeMode: 'contain' },
});
