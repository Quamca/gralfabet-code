import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ExerciseModule } from '../types';
import { GameScreen, RoundResult } from './GameScreen';
import { ResultScreen } from './ResultScreen';

function FindTheLetterModule(): React.ReactElement {
  const router = useRouter();
  const [phase, setPhase] = useState<'playing' | 'result'>('playing');
  const [results, setResults] = useState<RoundResult[]>([]);

  if (phase === 'playing') {
    return (
      <GameScreen
        onComplete={(r) => { setResults(r); setPhase('result'); }}
        onExit={() => router.push('/')}
      />
    );
  }

  return (
    <ResultScreen
      results={results}
      onPlayAgain={() => { setResults([]); setPhase('playing'); }}
      onExit={() => router.push('/')}
    />
  );
}

const findTheLetterModule: ExerciseModule = {
  id: 'find-the-letter',
  name: 'Znajdź literę',
  icon: require('../../assets/images/find-the-letter/tile-icon.png'),
  component: FindTheLetterModule,
  audioLabel: require('../../assets/sounds/find-the-letter/module-label.mp3') as number,
  tileColor: '#FFF3CD',
};

export default findTheLetterModule;
