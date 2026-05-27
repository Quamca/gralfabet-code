import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { type ExerciseModule } from '../types';
import { GameScreen, type CollectedDrawing } from './GameScreen';
import { ResultScreen } from './ResultScreen';

function LetterTraceModule(): React.ReactElement {
  const router   = useRouter();
  const [phase,    setPhase]    = useState<'playing' | 'result'>('playing');
  const [drawings, setDrawings] = useState<CollectedDrawing[]>([]);

  if (phase === 'playing') {
    return (
      <GameScreen
        onComplete={(d) => { setDrawings(d); setPhase('result'); }}
        onExit={() => router.push({ pathname: '/', params: { exit: '1' } })}
      />
    );
  }

  return (
    <ResultScreen
      drawings={drawings}
      onPlayAgain={() => { setDrawings([]); setPhase('playing'); }}
      onExit={() => router.push({ pathname: '/', params: { exit: '1' } })}
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
