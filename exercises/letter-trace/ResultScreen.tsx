import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SCREEN_BG } from '../shared/tokens';

interface Props {
  onPlayAgain: () => void;
  onExit:      () => void;
}

export function ResultScreen({ onPlayAgain, onExit }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Koniec!</Text>
      <Text style={styles.subtitle}>Narysowałeś 5 liter</Text>
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
  subtitle:  { fontSize: 22, color: '#666', marginBottom: 40 },
  buttons:   { gap: 16, width: '100%', maxWidth: 300 },
  btn:       { backgroundColor: '#4CAF50', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center' },
  btnText:   { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});
