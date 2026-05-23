import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';


interface Props {
  word: string;
  gapIndex: number;
  filledLetter: string | null;
}

export function WordDisplay({ word, gapIndex, filledLetter }: Props): React.ReactElement {
  const before = gapIndex === 0
    ? ''
    : word[0].toUpperCase() + word.slice(1, gapIndex).toLowerCase();
  const after  = word.slice(gapIndex + 1).toLowerCase();
  const isFirst = gapIndex === 0;

  return (
    <View style={styles.row}>
      {before.length > 0 && <Text style={styles.letter}>{before}</Text>}
      <View style={styles.gap}>
        {filledLetter ? (
          <Animated.Text entering={ZoomIn.duration(250)} style={styles.filled}>
            {isFirst ? filledLetter.toUpperCase() : filledLetter.toLowerCase()}
          </Animated.Text>
        ) : (
          <Text style={styles.blank}>_</Text>
        )}
      </View>
      {after.length > 0 && <Text style={styles.letter}>{after}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  letter: { fontSize: 72, fontWeight: 'bold', color: '#333' },
  gap:    { alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  filled: { fontSize: 72, fontWeight: 'bold', color: '#2E7D32' },
  blank:  { fontSize: 72, fontWeight: 'bold', color: '#BDBDBD' },
});
