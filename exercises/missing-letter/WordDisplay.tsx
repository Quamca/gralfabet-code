import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { CORRECT_BORDER } from '../shared/tokens';

interface Props {
  word: string;
  gapIndex: number;
  filledLetter: string | null;
}

export function WordDisplay({ word, gapIndex, filledLetter }: Props): React.ReactElement {
  const chars = word.split('').map((char, i) => {
    if (i === gapIndex) {
      if (filledLetter !== null) {
        const letter = gapIndex === 0 ? filledLetter.toUpperCase() : filledLetter;
        return <Text key={i} style={styles.filled}>{letter}</Text>;
      }
      return <Text key={i}>{'_'}</Text>;
    }
    return <Text key={i}>{i === 0 ? char.toUpperCase() : char}</Text>;
  });

  return <Text style={styles.word}>{chars}</Text>;
}

const styles = StyleSheet.create({
  word:   { fontSize: 48, fontWeight: 'bold', color: '#333', letterSpacing: 4, marginVertical: 12 },
  filled: { color: CORRECT_BORDER },
});
