import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import { useProgressStore } from '../../store/useProgressStore';
import { DOBRZE, FIND, LETTERS, MODULE_LABEL, TRY_AGAIN } from './audio-assets';

const EXIT_ICON   = require('../../assets/images/shared/exit-button.png');
const REPEAT_ICON = require('../../assets/images/shared/repeat-button.png');

export type Outcome = 'first-try' | 'second-try' | 'auto-reveal';
export type RoundResult = { letter: string; outcome: Outcome };

const ALL_LETTERS = Object.keys(LETTERS);
const TOTAL_ROUNDS = 5;
const HINT_DELAY_MS = 1500;

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
  const router = useRouter();
  const { selectLetters, updateLetter } = useProgressStore();
  const { playSequence, cancel, isPlaying } = useAudioSequence();

  const [rounds] = useState<string[]>(() => selectLetters(TOTAL_ROUNDS));
  const [roundIndex, setRoundIndex] = useState(0);
  const [tiles, setTiles] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [correctLetter, setCorrectLetter] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const lockedRef = useRef(false);
  const roundIndexRef = useRef(roundIndex);
  const resultsRef = useRef<RoundResult[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  roundIndexRef.current = roundIndex;

  useEffect(() => {
    return () => { cancel(); };
  }, [cancel]);

  useEffect(() => {
    const target = rounds[roundIndex];
    lockedRef.current = false;
    setErrors(0);
    setWrongLetters([]);
    setCorrectLetter(null);
    setShowHint(false);
    setTiles(pickTiles(target));
    cancel();
    const intro = roundIndex === 0 ? MODULE_LABEL : FIND;
    void playSequence([intro, LETTERS[target]]);
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
    if (wrongLetters.includes(letter)) return;
    const target = rounds[roundIndexRef.current];
    if (letter === target) {
      lockedRef.current = true;
      setCorrectLetter(letter);
      const outcome: Outcome = errors === 0 ? 'first-try' : 'second-try';
      updateLetter(target, outcome);
      resultsRef.current = [...resultsRef.current, { letter: target, outcome }];
      cancel();
      void playSequence([DOBRZE]).then(advance);
    } else {
      const newWrong = [...wrongLetters, letter];
      setWrongLetters(newWrong);
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= 2) {
        lockedRef.current = true;
        cancel();
        setShowHint(true);
        updateLetter(target, 'auto-reveal');
        resultsRef.current = [...resultsRef.current, { letter: target, outcome: 'auto-reveal' }];
        setTimeout(advance, HINT_DELAY_MS);
      } else {
        cancel();
        void playSequence([TRY_AGAIN]);
      }
    }
  }, [errors, wrongLetters, rounds, advance, cancel, updateLetter, playSequence]);

  const target = rounds[roundIndex];
  const canRepeat = !isPlaying && !showHint;

  const handleRepeat = useCallback(() => {
    if (!canRepeat) return;
    void playSequence([FIND, LETTERS[rounds[roundIndexRef.current]]]);
  }, [canRepeat, rounds, playSequence]);

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{roundIndex + 1} / {TOTAL_ROUNDS}</Text>
      <View style={styles.gridArea}>
        <TouchableOpacity style={[styles.repeatBtn, !canRepeat && styles.repeatBtnDisabled]} onPress={handleRepeat} activeOpacity={0.7}>
          <Image source={REPEAT_ICON} style={styles.repeatIcon} />
        </TouchableOpacity>
        <View style={styles.grid}>
          {tiles.map((letter) => {
            const isTarget = letter === target;
            const isWrong = wrongLetters.includes(letter);
            const isGreen = letter === correctLetter || (isTarget && showHint);
            const applyScale = isTarget && showHint;
            return (
              <Animated.View
                key={letter}
                style={[styles.tileWrap, applyScale ? { transform: [{ scale: pulseAnim }] } : {}]}
              >
                <TouchableOpacity
                  style={[styles.tile, isWrong && styles.tileWrong, isGreen && styles.tileHint]}
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
      <View style={styles.exitArea}>
        <TouchableOpacity style={styles.exitBtn} onPress={() => { cancel(); router.back(); }} activeOpacity={0.7}>
          <Image source={EXIT_ICON} style={styles.exitIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDE7', padding: 24 },
  progress: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 12 },
  repeatBtn: { alignSelf: 'center', marginBottom: 16 },
  repeatBtnDisabled: { opacity: 0.35 },
  repeatIcon: { width: 72, height: 72, resizeMode: 'contain' },
  gridArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  exitArea: { alignItems: 'center', paddingVertical: 20 },
  exitBtn: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  exitIcon: { width: 80, height: 80, resizeMode: 'contain' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  tileWrap: { width: '42%' },
  tile: { backgroundColor: '#FFF3CD', borderRadius: 16, paddingVertical: 24, alignItems: 'center', borderWidth: 2, borderColor: '#E8C83A' },
  tileWrong: { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
  tileHint: { backgroundColor: '#C8E6C9', borderColor: '#43A047' },
  tileUpper: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  tileLower: { fontSize: 24, color: '#666', marginTop: 4 },
});
