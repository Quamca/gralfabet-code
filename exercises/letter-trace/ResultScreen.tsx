import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SCREEN_BG } from '../shared/tokens';
import type { RoundOutcome } from './GameScreen';

const OUTCOME_LABEL: Record<RoundOutcome, string> = {
  'success':    '✓',
  'auto-reveal': '~',
};
const OUTCOME_COLOR: Record<RoundOutcome, string> = {
  'success':    '#43A047',
  'auto-reveal': '#90A4AE',
};

interface Props {
  outcomes:    RoundOutcome[];
  onPlayAgain: () => void;
  onExit:      () => void;
}

export function ResultScreen({ outcomes, onPlayAgain, onExit }: Props): React.ReactElement {
  const successCount = outcomes.filter(o => o === 'success').length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Koniec!</Text>
      <Text style={styles.subtitle}>
        Narysowałeś {successCount} z {outcomes.length} liter
      </Text>
      <View style={styles.dots}>
        {outcomes.map((o, i) => (
          <View
            key={i}
            style={[styles.dot, { backgroundColor: OUTCOME_COLOR[o] }]}
          >
            <Text style={styles.dotLabel}>{OUTCOME_LABEL[o]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7} style={styles.btn}>
          <Text style={styles.btnText}>Zagraj ponownie</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7} style={styles.btn}>
          <Text style={styles.btnText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SCREEN_BG, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title:     { fontSize: 40, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  subtitle:  { fontSize: 22, color: '#666', marginBottom: 32 },
  dots:      { flexDirection: 'row', gap: 12, marginBottom: 40 },
  dot:       { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dotLabel:  { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  buttons:   { gap: 16, width: '100%', maxWidth: 300 },
  btn:       { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center' },
  btnText:   { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});
