import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoundResult } from './GameScreen';

const EXIT_ICON       = require('../../assets/images/shared/exit-button.png');
const PLAY_AGAIN_ICON = require('../../assets/images/shared/play-again-button.png');

interface Props {
  results: RoundResult[];
  onPlayAgain: () => void;
  onExit: () => void;
}

export function ResultScreen({ results, onPlayAgain, onExit }: Props): React.ReactElement {
  const collected = results.filter((r) => r.outcome !== 'auto-reveal');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Zebrane litery</Text>

        {collected.length === 0 ? (
          <Text style={styles.emptyText}>Spróbuj jeszcze raz!</Text>
        ) : (
          <View style={styles.grid}>
            {collected.map(({ letter }) => (
              <View key={letter} style={styles.card}>
                <Text style={styles.cardUpper}>{letter.toUpperCase()}</Text>
                <Text style={styles.cardLower}>{letter}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={onPlayAgain} activeOpacity={0.7}>
          <Image source={PLAY_AGAIN_ICON} style={styles.btnIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={onExit} activeOpacity={0.7}>
          <Image source={EXIT_ICON} style={styles.btnIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#FFFDE7', padding: 24 },
  content:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:       { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  emptyText:   { fontSize: 24, color: '#888', textAlign: 'center' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card:        { backgroundColor: '#C8E6C9', borderRadius: 16, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', borderWidth: 2, borderColor: '#43A047', minWidth: '42%' },
  cardUpper:   { fontSize: 48, fontWeight: 'bold', color: '#333' },
  cardLower:   { fontSize: 24, color: '#666', marginTop: 4 },
  buttons:     { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 20 },
  btn:         { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  btnIcon:     { width: 80, height: 80, resizeMode: 'contain' },
});
