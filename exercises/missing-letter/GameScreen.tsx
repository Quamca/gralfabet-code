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
import {
  CONTAINER_PAD, CORRECT_BG, CORRECT_BORDER, DEFAULT_BG, DEFAULT_BORDER,
  SCREEN_BG, WRONG_BG, WRONG_BORDER,
} from '../shared/tokens';
import { FLY_DURATION_MS, FLY_FADE_MS } from '../shared/timings';
import { DOBRZE, FIND, LETTERS, TRY_AGAIN, WORD_CONTEXT } from './audio-assets';
import { ImageFanZone, type CollectedItem } from './ImageFanZone';
import { WordDisplay } from './WordDisplay';
import {
  FADE_OUT_MS, FAN_W, HINT_DELAY_MS, IMAGE_SIZE, REVEAL_STABLE_MS,
  STACK_PEEK, TILE_H, TILE_W, TOTAL_ROUNDS, WORD_KEYS, WORDS,
  pickTiles, selectGameLetters, type Outcome, type RoundResult, type WordEntry,
} from './gameUtils';

export type { Outcome, RoundResult };

const EXIT_ICON = require('../../assets/images/shared/exit-button.png');
const MAX_ERRORS = 2;

interface Props {
  onComplete: (results: RoundResult[], collected: CollectedItem[]) => void;
  onExit: () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { updateLetter } = useProgressStore();
  const { playSequence, cancel, isPlaying } = useAudioSequence();
  const { top: safeTop } = useSafeAreaInsets();

  const [rounds]     = useState<string[]>(() => selectGameLetters(TOTAL_ROUNDS));
  const [allEntries] = useState<WordEntry[]>(() => rounds.map((l) => {
    const pool = WORDS[l] ?? [];
    const withImg = pool.filter(e => e.image !== null);
    const src = withImg.length > 0 ? withImg : pool;
    return src[Math.floor(Math.random() * src.length)] ?? { word: l, gapIndex: 0, image: null };
  }));
  const [allTiles] = useState<string[][]>(() => rounds.map((l) => pickTiles(l, WORD_KEYS)));

  const [roundIndex, setRoundIndex]     = useState(0);
  const [errors, setErrors]             = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [showHint, setShowHint]         = useState(false);
  const [filledLetter, setFilledLetter] = useState<string | null>(null);
  const [isCorrect, setIsCorrect]       = useState(false);
  const [collected, setCollected]       = useState<CollectedItem[]>([]);

  const lockedRef     = useRef(false);
  const roundIndexRef = useRef(roundIndex);
  const resultsRef    = useRef<RoundResult[]>([]);
  const collectedRef  = useRef<CollectedItem[]>([]);
  const containerRef  = useRef<View>(null);
  const imageRef      = useRef<View>(null);
  roundIndexRef.current = roundIndex;

  // flyOpacity drives both the fly card opacity and the illustration visibility.
  // illustrationStyle hides the illustration on the UI thread whenever flyOpacity > 0 —
  // no isFlyingImage React state needed, so there is no JS→UI sync race on round transitions.
  const flyX            = useSharedValue(0);
  const flyY            = useSharedValue(0);
  const flyOpacity      = useSharedValue(0);
  const tilesOp         = useSharedValue(1);
  const hintOp          = useSharedValue(1);
  const pulseScale      = useSharedValue(1);
  const showIllustration = useSharedValue(1);

  const illustrationStyle = useAnimatedStyle(() => ({
    opacity: flyOpacity.value > 0 || showIllustration.value === 0 ? 0 : 1,
  }));
  const flyCardStyle = useAnimatedStyle(() => ({
    left:    flyX.value,
    top:     flyY.value,
    opacity: flyOpacity.value,
  }));
  const tileStyle = useAnimatedStyle(() => ({ opacity: tilesOp.value }));
  const hintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: hintOp.value,
  }));

  const setCollectedAndRef = useCallback((updater: React.SetStateAction<CollectedItem[]>) => {
    setCollected((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      collectedRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => { return () => { cancel(); }; }, [cancel]);

  useEffect(() => {
    showIllustration.value = 1;
    lockedRef.current = false;
    setErrors(0);
    setWrongLetters([]);
    setShowHint(false);
    setFilledLetter(null);
    setIsCorrect(false);
    tilesOp.value    = 1;
    hintOp.value     = 1;
    flyOpacity.value = withTiming(0, { duration: 120 });
    cancel();
    const entry  = allEntries[roundIndex];
    const target = rounds[roundIndex];
    const key    = entry.gapIndex === 0 ? `jak-${entry.word}` : `w-słowie-${entry.word}`;
    void playSequence(roundIndex === 0
      ? [FIND, LETTERS[target], WORD_CONTEXT[key]]
      : [LETTERS[target], WORD_CONTEXT[key]]);
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
    showIllustration.value = 0;
    lockedRef.current = false;
    setFilledLetter(null);
    setWrongLetters([]);
    setShowHint(false);
    roundIndexRef.current < TOTAL_ROUNDS - 1
      ? setRoundIndex((r) => r + 1)
      : onComplete(resultsRef.current, collectedRef.current);
  }, [onComplete]);

  const startFly = useCallback((letter: string, entry: WordEntry, outcome: Outcome) => {
    const newItem: CollectedItem = { image: entry.image, word: entry.word };
    const idx       = collectedRef.current.length;
    const stackBase = (FAN_W - IMAGE_SIZE - (TOTAL_ROUNDS - 1) * STACK_PEEK) / 2;
    const targetX   = CONTAINER_PAD + stackBase + idx * STACK_PEEK;
    const targetY   = safeTop + CONTAINER_PAD + 8;

    setFilledLetter(letter);
    setIsCorrect(true);
    void playSequence([DOBRZE]);

    setTimeout(() => {
      containerRef.current?.measure((_a, _b, _c, _d, cPx, cPy) => {
        imageRef.current?.measure((_a, _b, _c, _d, iPx, iPy) => {
          flyX.value = iPx - cPx;
          flyY.value = iPy - cPy;
          flyOpacity.value = 1;

          flyX.value    = withTiming(targetX, { duration: FLY_DURATION_MS });
          flyY.value    = withTiming(targetY, { duration: FLY_DURATION_MS });
          tilesOp.value = withTiming(0, { duration: 400 });

          updateLetter(letter, outcome);
          resultsRef.current = [...resultsRef.current, { letter, outcome }];
          cancel();

          setTimeout(() => {
            showIllustration.value = 0;
            flyOpacity.value = withTiming(0, { duration: FLY_FADE_MS });
            setIsCorrect(false);
            setTimeout(() => {
              setCollectedAndRef((prev) => [...prev, newItem]);
              advance();
            }, FLY_FADE_MS);
          }, FLY_DURATION_MS);
        });
      });
    }, REVEAL_STABLE_MS);
  }, [safeTop, playSequence, cancel, updateLetter, advance, setCollectedAndRef,
      flyX, flyY, flyOpacity, tilesOp, showIllustration]);

  const handleTilePress = useCallback((letter: string) => {
    if (lockedRef.current) return;
    if (wrongLetters.includes(letter)) return;
    const target = rounds[roundIndexRef.current];

    if (letter === target) {
      lockedRef.current = true;
      const outcome: Outcome = errors === 0 ? 'first-try' : 'second-try';
      startFly(letter, allEntries[roundIndexRef.current], outcome);
    } else {
      const newErrors = errors + 1;
      setErrors(newErrors);
      setWrongLetters((w) => [...w, letter]);

      if (newErrors >= MAX_ERRORS) {
        lockedRef.current = true;
        cancel();
        setShowHint(true);
        updateLetter(target, 'auto-reveal');
        resultsRef.current = [...resultsRef.current, { letter: target, outcome: 'auto-reveal' }];
        tilesOp.value = withTiming(0, { duration: 400 });

        setTimeout(() => {
          cancelAnimation(pulseScale);
          pulseScale.value = withTiming(1, { duration: 100 });
          setTimeout(() => {
            hintOp.value = withTiming(0, { duration: FADE_OUT_MS });
            setTimeout(advance, FADE_OUT_MS);
          }, REVEAL_STABLE_MS);
        }, HINT_DELAY_MS);
      } else {
        cancel();
        void playSequence([TRY_AGAIN]);
      }
    }
  }, [errors, wrongLetters, rounds, allEntries, startFly, cancel, updateLetter,
      playSequence, advance, pulseScale, tilesOp, hintOp]);

  const canRepeat    = !isPlaying && !showHint;
  const currentEntry = allEntries[roundIndex];
  const target       = rounds[roundIndex];
  const tiles        = allTiles[roundIndex];

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={[styles.content, { paddingTop: safeTop + CONTAINER_PAD }]}>
        <ImageFanZone items={collected} />

        <View style={styles.centerArea}>
          <Animated.View
            ref={imageRef}
            style={[
              styles.illustration,
              illustrationStyle,
              isCorrect && { backgroundColor: CORRECT_BG, borderWidth: 2, borderColor: CORRECT_BORDER },
            ]}
          >
            {currentEntry.image
              ? <Image source={currentEntry.image} style={styles.image} />
              : <View style={styles.imgPlaceholder} />}
          </Animated.View>

          <WordDisplay
            word={currentEntry.word}
            gapIndex={currentEntry.gapIndex}
            filledLetter={filledLetter}
          />

          <ReplayButton
            onPress={() => {
              if (canRepeat) {
                const key = currentEntry.gapIndex === 0
                  ? `jak-${currentEntry.word}`
                  : `w-słowie-${currentEntry.word}`;
                void playSequence([LETTERS[target], WORD_CONTEXT[key]]);
              }
            }}
            disabled={!canRepeat}
          />

          <View style={styles.grid}>
            {tiles.map((letter) => {
              const isWrong    = wrongLetters.includes(letter);
              const isHintTile = letter === target && showHint;
              const isCorrectTile = letter === filledLetter;
              return (
                <Animated.View key={letter} style={isHintTile ? hintStyle : tileStyle}>
                  <TouchableOpacity
                    style={[
                      styles.tile,
                      isWrong       && { backgroundColor: WRONG_BG,   borderColor: WRONG_BORDER },
                      isHintTile    && { backgroundColor: CORRECT_BG, borderColor: CORRECT_BORDER },
                      isCorrectTile && { backgroundColor: CORRECT_BG, borderColor: CORRECT_BORDER },
                    ]}
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

      <Animated.View style={[styles.flyCard, flyCardStyle]} pointerEvents="none">
        {currentEntry.image
          ? <Image source={currentEntry.image} style={styles.flyImage} />
          : <Text style={styles.flySymbol}>_</Text>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: 'transparent' },
  content:        { flex: 1, paddingHorizontal: CONTAINER_PAD },
  centerArea:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration:   { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  image:          { width: IMAGE_SIZE, height: IMAGE_SIZE, resizeMode: 'contain' },
  imgPlaceholder: { width: IMAGE_SIZE, height: IMAGE_SIZE, backgroundColor: '#E0E0E0', borderRadius: 16 },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 16 },
  tile:           { width: TILE_W, height: TILE_H, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: DEFAULT_BG, borderWidth: 2, borderColor: DEFAULT_BORDER },
  tileUpper:      { fontSize: 40, fontWeight: 'bold', color: '#333' },
  tileLower:      { fontSize: 22, color: '#555' },
  bottom:         { paddingVertical: 20, alignItems: 'center' },
  exitIcon:       { width: 80, height: 80, resizeMode: 'contain' },
  flyCard:        { position: 'absolute', width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 12, overflow: 'hidden', backgroundColor: CORRECT_BG, borderWidth: 2, borderColor: CORRECT_BORDER, zIndex: 999 },
  flyImage:       { width: IMAGE_SIZE, height: IMAGE_SIZE, resizeMode: 'contain' },
  flySymbol:      { fontSize: 48, color: '#555' },
});
