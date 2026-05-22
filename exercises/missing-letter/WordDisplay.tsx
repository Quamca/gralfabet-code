import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { CORRECT_BG, CORRECT_BORDER } from '../shared/tokens';

interface Props {
  word: string;
  gapIndex: number;
  filledLetter: string | null;
}

export function WordDisplay({ word, gapIndex, filledLetter }: Props): React.ReactElement {
  const upper = word.slice(0, gapIndex).toUpperCase();
  const lower = word.slice(gapIndex + 1).toUpperCase();

  return (
    <View style={styles.row}>
      {upper.length > 0 && <Text style={styles.letter}>{upper}</Text>}
      <View style={styles.gap}>
        {filledLetter ? (
          <Animated.Text entering={ZoomIn.duration(250)} style={styles.filled}>
            {filledLetter.toUpperCase()}
          </Animated.Text>
        ) : (
          <Text style={styles.blank}>_</Text>
        )}
      </View>
      {lower.length > 0 && <Text style={styles.letter}>{lower}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  letter: { fontSize: 56, fontWeight: 'bold', color: '#333' },
  gap:    { width: 64, height: 72, backgroundColor: CORRECT_BG, borderRadius: 8, borderWidth: 2, borderColor: CORRECT_BORDER, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  filled: { fontSize: 52, fontWeight: 'bold', color: '#2E7D32' },
  blank:  { fontSize: 52, fontWeight: 'bold', color: '#BDBDBD' },
});
