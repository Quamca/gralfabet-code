import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { type ExerciseModule } from '../types';
import { GameScreen, type RoundOutcome } from './GameScreen';
import { ResultScreen } from './ResultScreen';

function LetterTraceModule(): React.ReactElement {
  const router   = useRouter();
  const [phase,   setPhase]    = useState<'playing' | 'result'>('playing');
  const [outcomes, setOutcomes] = useState<RoundOutcome[]>([]);

  if (phase === 'playing') {
    return (
      <GameScreen
        onComplete={(o) => { setOutcomes(o); setPhase('result'); }}
        onExit={() => router.back()}
      />
    );
  }

  return (
    <ResultScreen
      outcomes={outcomes}
      onPlayAgain={() => { setOutcomes([]); setPhase('playing'); }}
      onExit={() => router.back()}
    />
  );
}

const letterTraceModule: ExerciseModule = {
  id:        'letter-trace',
  name:      'Odrysuj literę',
  icon:      require('../../assets/images/letter-trace/tile-icon.png'),
  component: LetterTraceModule,
  tileColor: '#E3F2FD',
};

export default letterTraceModule;
