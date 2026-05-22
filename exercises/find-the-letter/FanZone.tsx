import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FAN_W, STACK_PEEK, TILE_H, TILE_W, TOTAL_ROUNDS } from './gameUtils';

interface Props {
  letters: string[];
}

const STACK_BASE = (FAN_W - TILE_W - (TOTAL_ROUNDS - 1) * STACK_PEEK) / 2;

export function FanZone({ letters }: Props): React.ReactElement {
  return (
    <View style={styles.zone}>
      {letters.map((letter, i) => (
        <View key={letter} style={[styles.card, { left: STACK_BASE + i * STACK_PEEK, zIndex: i }]}>
          <Text style={styles.upper}>{letter.toUpperCase()}</Text>
          <Text style={styles.lower}>{letter}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zone:  { width: '100%', height: TILE_H + 16, position: 'relative' },
  card:  { position: 'absolute', top: 8, width: TILE_W, height: TILE_H, backgroundColor: '#C8E6C9', borderRadius: 16, borderWidth: 2, borderColor: '#43A047', alignItems: 'center', justifyContent: 'center' },
  upper: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  lower: { fontSize: 24, color: '#666', marginTop: 4 },
});
