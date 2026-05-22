import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ExerciseModule } from '../types';
import { GameScreen } from './GameScreen';
import { type CollectedItem } from './ImageFanZone';
import { ResultScreen } from './ResultScreen';

function MissingLetterModule(): React.ReactElement {
  const router = useRouter();
  const [phase, setPhase]         = useState<'playing' | 'result'>('playing');
  const [collected, setCollected] = useState<CollectedItem[]>([]);

  if (phase === 'playing') {
    return (
      <GameScreen
        onComplete={(_results, c) => { setCollected(c); setPhase('result'); }}
        onExit={() => router.back()}
      />
    );
  }

  return (
    <ResultScreen
      collected={collected}
      onPlayAgain={() => { setCollected([]); setPhase('playing'); }}
      onExit={() => router.back()}
    />
  );
}

const missingLetterModule: ExerciseModule = {
  id: 'missing-letter',
  name: 'Brakująca litera',
  icon: null as unknown as number,
  component: MissingLetterModule,
  audioLabel: null as unknown as number,
  tileColor: '#E8F5E9',
};

export default missingLetterModule;
