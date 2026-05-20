import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ExerciseModule } from '../types';
import { GameScreen } from './GameScreen';

function FindTheLetterModule(): React.ReactElement {
  const router = useRouter();
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');

  if (phase === 'playing') {
    return <GameScreen onComplete={() => setPhase('result')} />;
  }

  return (
    <View style={styles.result}>
      <Text style={styles.title}>Koniec!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Wróć do menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  result: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDE7' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 32 },
  button: { backgroundColor: '#F57F17', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

const findTheLetterModule: ExerciseModule = {
  id: 'find-the-letter',
  name: 'Znajdź literę',
  icon: require('../../assets/images/find-the-letter/tile-icon.png'),
  component: FindTheLetterModule,
  audioLabel: require('../../assets/sounds/find-the-letter/module-label.mp3') as number,
  tileColor: '#FFF3CD',
};

export default findTheLetterModule;
