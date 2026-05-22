import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation, useAnimatedStyle, useSharedValue,
  withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import { useProgressStore } from '../../store/useProgressStore';
import { ReplayButton } from '../shared/ReplayButton';
import { TRY_AGAIN } from './audio-assets';
import { ImageFanZone, type CollectedItem } from './ImageFanZone';
import { useFlyAnimation } from './useFlyAnimation';
import { WordDisplay } from './WordDisplay';
import {
  CONTAINER_PAD, FADE_OUT_MS, HINT_DELAY_MS, REVEAL_STABLE_MS,
  TILE_H, TILE_W, TOTAL_ROUNDS, WORD_KEYS, WORDS,
  pickTiles, selectGameLetters, type Outcome, type RoundResult, type WordEntry,
} from './gameUtils';

export type { Outcome, RoundResult };

const EXIT_ICON = require('../../assets/images/shared/exit-button.png');

interface Props {
  onComplete: (results: RoundResult[], collected: CollectedItem[]) => void;
  onExit: () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { updateLetter } = useProgressStore();
  const { playSequence, cancel, isPlaying } = useAudioSequence();
  const { top: safeTop } = useSafeAreaInsets();
  const fly = useFlyAnimation();

  const [rounds]     = useState<string[]>(() => selectGameLetters(TOTAL_ROUNDS));
  const [allEntries] = useState<WordEntry[]>(() => rounds.map((l) => {
    const pool = WORDS[l] ?? [];
    return pool[Math.floor(Math.random() * pool.length)] ??
      { word: l, gapIndex: 0, image: null, audioInstruction: null, audioShort: null, audioWord: null };
  }));
  const [allTiles]   = useState<string[][]>(() => rounds.map((l) => pickTiles(l, WORD_KEYS)));
  const [roundIndex, setRoundIndex]     = useState(0);
  const [errors, setErrors]             = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [showHint, setShowHint]         = useState(false);
  const [filledLetter, setFilledLetter] = useState<string | null>(null);
  const [collected, setCollected]       = useState<CollectedItem[]>([]);

  const lockedRef      = useRef(false);
  const roundIndexRef  = useRef(roundIndex);
  const resultsRef     = useRef<RoundResult[]>([]);
  const collectedRef   = useRef<CollectedItem[]>([]);
  const containerRef   = useRef<View>(null);
  const imageRef       = useRef<View>(null);
  roundIndexRef.current = roundIndex;

  const setCollectedAndRef = useCallback((updater: React.SetStateAction<CollectedItem[]>) => {
    setCollected((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      collectedRef.current = next;
      return next;
    });
  }, []);

  const pulseScale = useSharedValue(1);
  const tileStyle  = useAnimatedStyle(() => ({ opacity: fly.tilesOp.value }));
  const hintStyle  = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], opacity: fly.hintOp.value }));

  useEffect(() => { return () => { cancel(); }; }, [cancel]);

  useEffect(() => {
    lockedRef.current = false;
    setErrors(0);
    setWrongLetters([]);
    setShowHint(false);
    setFilledLetter(null);
    fly.resetWrongs();
    cancel();
    const entry = allEntries[roundIndex];
    const audio = roundIndex === 0 ? entry.audioInstruction : entry.audioShort;
    if (audio) void playSequence([audio]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex]);

  useEffect(() => {
    if (showHint) {
      pulseScale.value = withRepeat(
        withSequence(withTiming(1.15, { duration: 350 }), withTiming(1, { duration: 350 })),
        -1, false,
      );
    } else {
      cancelAnimation(pulseScale);
      pulseScale.value = withTiming(1, { duration: 100 });
    }
  }, [showHint, pulseScale]);

  const advance = useCallback(() => {
    lockedRef.current = false;
    setFilledLetter(null);
    setWrongLetters([]);
    setShowHint(false);
    roundIndexRef.current < TOTAL_ROUNDS - 1
      ? setRoundIndex((r) => r + 1)
      : onComplete(resultsRef.current, collectedRef.current);
  }, [onComplete]);

  const handleTilePress = useCallback((letter: string) => {
    if (lockedRef.current) return;
    if (wrongLetters.includes(letter)) return;
    const target = rounds[roundIndexRef.current];
    if (letter === target) {
      lockedRef.current = true;
      fly.startFly({
        safeTopOffset: safeTop, letter,
        currentEntry: allEntries[roundIndexRef.current],
        outcome: errors === 0 ? 'first-try' : 'second-try',
        collected, containerRef, imageRef, advance, cancel,
        playSequence, updateLetter, resultsRef,
        setCollected: setCollectedAndRef, setFilledLetter,
      });
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setWrongLetters((w) => [...w, letter]);
      if (newErrors >= 2) {
        lockedRef.current = true;
        cancel();
        setShowHint(true);
        updateLetter(target, 'auto-reveal');
        resultsRef.current = [...resultsRef.current, { letter: target, outcome: 'auto-reveal' }];
        fly.dropWrongs();
        setTimeout(() => {
          cancelAnimation(pulseScale);
          pulseScale.value = withTiming(1, { duration: 100 });
          setTimeout(() => { fly.dropHint(); setTimeout(advance, FADE_OUT_MS); }, REVEAL_STABLE_MS);
        }, HINT_DELAY_MS);
      } else {
        cancel();
        if (TRY_AGAIN) void playSequence([TRY_AGAIN]);
      }
    }
  }, [errors, wrongLetters, rounds, collected, safeTop, advance, cancel, updateLetter, playSequence, fly, allEntries, pulseScale, setCollectedAndRef]);

  const canRepeat    = !isPlaying && !showHint;
  const currentEntry = allEntries[roundIndex];
  const target       = rounds[roundIndex];
  const tiles        = allTiles[roundIndex];

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={[styles.content, { paddingTop: safeTop + CONTAINER_PAD }]}>
        <ImageFanZone items={collected} />
        <View style={styles.centerArea}>
          <View ref={imageRef} style={[styles.illustration, fly.isFlyingImage && styles.hidden]}>
            {currentEntry.image
              ? <Image source={currentEntry.image} style={styles.image} />
              : <View style={styles.imgPlaceholder} />}
          </View>
          <WordDisplay word={currentEntry.word} gapIndex={currentEntry.gapIndex} filledLetter={filledLetter} />
          <ReplayButton
            onPress={() => {
              if (canRepeat) {
                const a = roundIndex === 0 ? currentEntry.audioInstruction : currentEntry.audioShort;
                if (a) void playSequence([a]);
              }
            }}
            disabled={!canRepeat}
          />
          <View style={styles.grid}>
            {tiles.map((letter) => {
              const isWrong = wrongLetters.includes(letter);
              const isHint  = letter === target && showHint;
              return (
                <Animated.View key={letter} style={isHint ? hintStyle : tileStyle}>
                  <TouchableOpacity
                    style={[styles.tile, isWrong && styles.tileWrong, isHint && styles.tileHint]}
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
        <View style={styles.bottom}>
          <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
            <Image source={EXIT_ICON} style={styles.exitIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {fly.isFlyingImage && (
        <Animated.View style={[styles.flyCard, fly.flyStyle]} pointerEvents="none">
          {currentEntry.image
            ? <Image source={currentEntry.image} style={styles.flyImage} />
            : <View style={styles.flyPlaceholder} />}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#FFFDE7' },
  content:       { flex: 1, padding: CONTAINER_PAD },
  centerArea:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration:  { width: 180, height: 180, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  hidden:        { opacity: 0 },
  image:         { width: 160, height: 160, resizeMode: 'contain' },
  imgPlaceholder:{ width: 160, height: 160, backgroundColor: '#E0E0E0', borderRadius: 12 },
  bottom:        { alignItems: 'center', paddingVertical: 20 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 16 },
  tile:          { width: TILE_W, height: TILE_H, backgroundColor: '#FFF3CD', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E8C83A' },
  tileWrong:     { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
  tileHint:      { backgroundColor: '#C8E6C9', borderColor: '#43A047' },
  tileUpper:     { fontSize: 48, fontWeight: 'bold', color: '#333' },
  tileLower:     { fontSize: 24, color: '#666', marginTop: 4 },
  exitIcon:      { width: 80, height: 80, resizeMode: 'contain' },
  flyCard:       { position: 'absolute', zIndex: 999, width: 100, height: 100, backgroundColor: '#C8E6C9', borderRadius: 12, borderWidth: 2, borderColor: '#43A047', alignItems: 'center', justifyContent: 'center' },
  flyImage:      { width: 84, height: 84, resizeMode: 'contain' },
  flyPlaceholder:{ width: 84, height: 84, backgroundColor: '#B0BEC5', borderRadius: 8 },
});
