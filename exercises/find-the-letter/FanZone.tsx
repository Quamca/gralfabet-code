import React, { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { STACK_PEEK, TILE_H, TILE_W } from './gameUtils';

interface Props {
  letters: string[];
}

export function FanZone({ letters }: Props): React.ReactElement {
  const [zoneWidth, setZoneWidth] = useState(0);

  function onLayout(e: LayoutChangeEvent) {
    setZoneWidth(e.nativeEvent.layout.width);
  }

  function stackLeft(index: number, total: number): number {
    return (zoneWidth - TILE_W - (total - 1) * STACK_PEEK) / 2 + index * STACK_PEEK;
  }

  return (
    <View style={styles.zone} onLayout={onLayout}>
      {letters.map((letter, i) => (
        <View
          key={letter}
          style={[
            styles.card,
            { left: stackLeft(i, letters.length), zIndex: i },
          ]}
        >
          <Text style={styles.upper}>{letter.toUpperCase()}</Text>
          <Text style={styles.lower}>{letter}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    width: '100%',
    height: TILE_H + 16,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    top: 8,
    width: TILE_W,
    height: TILE_H,
    backgroundColor: '#C8E6C9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#43A047',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upper: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  lower: { fontSize: 24, color: '#666', marginTop: 4 },
});
