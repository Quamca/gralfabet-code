import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import { useProgressStore } from '../../store/useProgressStore';
import { CONFIRM_ITS, FIND, LETTERS, TRY_AGAIN } from './audio-assets';

export type Outcome = 'first-try' | 'second-try' | 'auto-reveal';
export type RoundResult = { letter: string; outcome: Outcome };

const ALL_LETTERS = Object.keys(LETTERS);
const TOTAL_ROUNDS = 5;
const HINT_DELAY_MS = 1500;
const WRONG_FLASH_MS = 600;

function pickTiles(target: string): string[] {
  const pool = ALL_LETTERS.filter((l) => l !== target);
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!distractors.includes(pool[idx])) distractors.push(pool[idx]);
  }
  const tiles = [target, ...distractors];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

interface Props {
  onComplete: (results: RoundResult[]) => void;
}

export function GameScreen({ onComplete }: Props): React.ReactElement {
  const { selectLetters, updateLetter } = useProgressStore();
  const { playSequence, cancel } = useAudioSequence();

  const [rounds] = useState<string[]>(() => selectLetters(TOTAL_ROUNDS));
  const [roundIndex, setRoundIndex] = useState(0);
  const [tiles, setTiles] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const lockedRef = useRef(false);
  const roundIndexRef = useRef(roundIndex);
  const resultsRef = useRef<RoundResult[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  roundIndexRef.current = roundIndex;

  useEffect(() => {
    const target = rounds[roundIndex];
    lockedRef.current = false;
    setErrors(0);
    setWrongLetter(null);
    setShowHint(false);
    setTiles(pickTiles(target));
    cancel();
    void playSequence([FIND, LETTERS[target]]);
  }, [roundIndex, rounds, cancel, playSequence]);

  useEffect(() => {
    if (showHint) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 350, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [showHint, pulseAnim]);

  const advance = useCallback(() => {
    lockedRef.current = false;
    if (roundIndexRef.current < TOTAL_ROUNDS - 1) {
      setRoundIndex((r) => r + 1);
    } else {
      onComplete(resultsRef.current);
    }
  }, [onComplete]);

  const handleTilePress = useCallback((letter: string) => {
    if (lockedRef.current) return;
    const target = rounds[roundIndexRef.current];
    if (letter === target) {
      lockedRef.current = true;
      const outcome: Outcome = errors === 0 ? 'first-try' : 'second-try';
      updateLetter(target, outcome);
      resultsRef.current = [...resultsRef.current, { letter: target, outcome }];
      void playSequence([CONFIRM_ITS, LETTERS[target]]).then(advance);
    } else {
      setWrongLetter(letter);
      setTimeout(() => setWrongLetter(null), WRONG_FLASH_MS);
      const newErrors = errors + 1;
      setErrors(newErrors);
      void playSequence([TRY_AGAIN]);
      if (newErrors >= 2) {
        lockedRef.current = true;
        setShowHint(true);
        updateLetter(target, 'auto-reveal');
        resultsRef.current = [...resultsRef.current, { letter: target, outcome: 'auto-reveal' }];
        setTimeout(advance, HINT_DELAY_MS);
      }
    }
  }, [errors, rounds, advance, updateLetter, playSequence]);

  const target = rounds[roundIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundIndex + 1} / {TOTAL_ROUNDS}</Text>
      <Text style={styles.prompt}>
        Znajdź:{' '}
        <Text style={styles.promptLetter}>{target?.toUpperCase()}</Text>
      </Text>
      <View style={styles.grid}>
        {tiles.map((letter) => {
          const isTarget = letter === target;
          const isWrong = letter === wrongLetter;
          const applyScale = isTarget && showHint;
          return (
            <Animated.View
              key={letter}
              style={[styles.tileWrap, applyScale ? { transform: [{ scale: pulseAnim }] } : {}]}
            >
              <TouchableOpacity
                style={[styles.tile, isWrong && styles.tileWrong, isTarget && showHint && styles.tileHint]}
                onPress={() => handleTilePress(letter)}
                activeOpacity={0.7}
              >
                <Text style={styles.tileUpper}>{letter.toUpperCase()}</Text>
                <Text style={styles.tileLower}>{letter}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDE7', padding: 24 },
  progress: { fontSize: 16, color: '#888', marginBottom: 8 },
  prompt: { fontSize: 24, fontWeight: '600', marginBottom: 32, color: '#333' },
  promptLetter: { color: '#F57F17', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  tileWrap: { width: '42%' },
  tile: { backgroundColor: '#FFF3CD', borderRadius: 16, paddingVertical: 24, alignItems: 'center', borderWidth: 2, borderColor: '#E8C83A' },
  tileWrong: { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
  tileHint: { backgroundColor: '#C8E6C9', borderColor: '#43A047' },
  tileUpper: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  tileLower: { fontSize: 24, color: '#666', marginTop: 4 },
});
