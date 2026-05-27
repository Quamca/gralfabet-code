import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FLY_FADE_MS } from '../shared/timings';
import { CORRECT_BG, CORRECT_BORDER } from '../shared/tokens';
import { FAN_W, IMAGE_SIZE, STACK_PEEK, TOTAL_ROUNDS } from './gameUtils';

export type CollectedItem = { image: number | null; word: string };

interface Props { items: CollectedItem[] }

const STACK_BASE = (FAN_W - IMAGE_SIZE - (TOTAL_ROUNDS - 1) * STACK_PEEK) / 2;

export function ImageFanZone({ items }: Props): React.ReactElement {
  return (
    <View style={styles.zone}>
      {items.map((item, i) => (
        <Animated.View
          key={item.word + i}
          entering={FadeIn.duration(FLY_FADE_MS)}
          style={[styles.card, { left: STACK_BASE + i * STACK_PEEK, zIndex: i }]}
        >
          {item.image
            ? <Image source={item.image} style={styles.img} />
            : <View style={styles.placeholder} />}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zone:        { width: '100%', height: IMAGE_SIZE + 16, position: 'relative' },
  card:        { position: 'absolute', top: 8, width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 16, backgroundColor: CORRECT_BG, borderWidth: 2, borderColor: CORRECT_BORDER, overflow: 'hidden' },
  img:         { width: IMAGE_SIZE, height: IMAGE_SIZE, resizeMode: 'contain' },
  placeholder: { width: IMAGE_SIZE, height: IMAGE_SIZE, backgroundColor: '#B0BEC5' },
});
