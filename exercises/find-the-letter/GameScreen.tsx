import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation, useAnimatedStyle, useSharedValue,
  withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import { useProgressStore } from '../../store/useProgressStore';
import { FIND, LETTERS, MODULE_LABEL, TRY_AGAIN } from './audio-assets';
import { FanZone } from './FanZone';
import {
  CONTAINER_PAD, HINT_DELAY_MS, TILE_H, TILE_W, TOTAL_ROUNDS,
  pickTiles, type Outcome, type RoundResult,
} from './gameUtils';
import { useFlyAnimation } from './useFlyAnimation';

export type { Outcome, RoundResult };

const EXIT_ICON   = require('../../assets/images/shared/exit-button.png');
const REPEAT_ICON = require('../../assets/images/shared/repeat-button.png');

interface Props {
  onComplete: (results: RoundResult[]) => void;
  onExit: () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { selectLetters, updateLetter } = useProgressStore();
  const { playSequence, cancel, isPlaying } = useAudioSequence();
  const { top: safeTop } = useSafeAreaInsets();
  const fly      = useFlyAnimation();
  const tilesOp  = fly.tilesOp;
  const hintOp   = fly.hintOp;

  const [rounds]      = useState<string[]>(() => selectLetters(TOTAL_ROUNDS));
  const [allTiles]    = useState<string[][]>(() => rounds.map(pickTiles));
  const [roundIndex, setRoundIndex] = useState(0);
  const tiles         = allTiles[roundIndex];
  const [errors, setErrors]         = useState(0);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [showHint, setShowHint]     = useState(false);
  const [collected, setCollected]   = useState<string[]>([]);

  const lockedRef     = useRef(false);
  const roundIndexRef = useRef(roundIndex);
  const resultsRef    = useRef<RoundResult[]>([]);
  const containerRef  = useRef<View>(null);
  const tileRefs      = useRef<Record<string, View | null>>({});
  roundIndexRef.current = roundIndex;

  const pulseScale = useSharedValue(1);
  const tileStyle  = useAnimatedStyle(() => ({ opacity: tilesOp.value }));
  const hintStyle  = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], opacity: hintOp.value }));

  useEffect(() => { return () => { cancel(); }; }, [cancel]);

  useEffect(() => {
    const target = rounds[roundIndex];
    lockedRef.current = false;
    setErrors(0);
    setWrongLetters([]);
    setShowHint(false);
    fly.resetWrongs();
    cancel();
    void playSequence([roundIndex === 0 ? MODULE_LABEL : FIND, LETTERS[target]]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex, rounds, cancel, playSequence]);

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
    setWrongLetters([]);
    setShowHint(false);
    roundIndexRef.current < TOTAL_ROUNDS - 1
      ? setRoundIndex((r) => r + 1)
      : onComplete(resultsRef.current);
  }, [onComplete]);

  const handleTilePress = useCallback((letter: string) => {
    if (lockedRef.current) return;
    if (wrongLetters.includes(letter)) return;
    const target = rounds[roundIndexRef.current];
    if (letter === target) {
      lockedRef.current = true;
      fly.startFly({
        safeTopOffset: safeTop,
        letter,
        outcome: errors === 0 ? 'first-try' : 'second-try',
        collected, containerRef, tileRefs, advance, cancel,
        playSequence, updateLetter, resultsRef, setCollected,
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
        setTimeout(() => { cancelAnimation(pulseScale); pulseScale.value = withTiming(1, { duration: 100 }); setTimeout(() => { fly.dropHint(); setTimeout(advance, 300); }, 350); }, HINT_DELAY_MS);
      } else {
        cancel();
        void playSequence([TRY_AGAIN]);
      }
    }
  }, [errors, wrongLetters, rounds, collected, safeTop, advance, cancel, updateLetter, playSequence, fly]);

  const canRepeat = !isPlaying && !showHint;
  const target    = rounds[roundIndex];

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={[styles.content, { paddingTop: safeTop + CONTAINER_PAD }]}>
        <FanZone letters={collected} />
        <View style={styles.gridArea}>
          <TouchableOpacity
            style={[styles.repeatBtn, !canRepeat && styles.dim]}
            onPress={() => { if (canRepeat) void playSequence([FIND, LETTERS[rounds[roundIndexRef.current]]]); }}
            activeOpacity={0.7}
          >
            <Image source={REPEAT_ICON} style={styles.repeatIcon} />
          </TouchableOpacity>
          <View style={styles.grid}>
            {tiles.map((letter) => {
              const isWrong      = wrongLetters.includes(letter);
              const isHint       = letter === target && showHint;
              const isFlyingAway = letter === fly.flyingLetter;
              return (
                <View
                  key={letter}
                  ref={(r) => { tileRefs.current[letter] = r; }}
                  style={isFlyingAway ? styles.invisible : undefined}
                >
                  <Animated.View style={isHint ? hintStyle : tileStyle}>
                    <TouchableOpacity
                      style={[styles.tile, isWrong && styles.tileWrong, isHint && styles.tileHint]}
                      onPress={() => handleTilePress(letter)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.tileUpper}>{letter.toUpperCase()}</Text>
                      <Text style={styles.tileLower}>{letter}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
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
      {fly.flyingLetter !== null && (
        <Animated.View
          style={[styles.flyCard, { width: TILE_W, height: TILE_H }, fly.flyStyle]}
          pointerEvents="none"
        >
          <Text style={styles.tileUpper}>{fly.flyingLetter.toUpperCase()}</Text>
          <Text style={styles.tileLower}>{fly.flyingLetter}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#FFFDE7' },
  content:     { flex: 1, padding: CONTAINER_PAD },
  gridArea:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom:      { alignItems: 'center', paddingVertical: 20 },
  repeatBtn:   { alignSelf: 'center', marginBottom: 16 },
  dim:         { opacity: 0.35 },
  invisible:   { opacity: 0 },
  repeatIcon:  { width: 72, height: 72, resizeMode: 'contain' },
  exitIcon:    { width: 80, height: 80, resizeMode: 'contain' },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  tile:        { width: TILE_W, height: TILE_H, backgroundColor: '#FFF3CD', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E8C83A' },
  tileWrong:   { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
  tileHint:    { backgroundColor: '#C8E6C9', borderColor: '#43A047' },
  tileUpper:   { fontSize: 48, fontWeight: 'bold', color: '#333' },
  tileLower:   { fontSize: 24, color: '#666', marginTop: 4 },
  flyCard:     { position: 'absolute', zIndex: 999, backgroundColor: '#C8E6C9', borderRadius: 16, borderWidth: 2, borderColor: '#43A047', alignItems: 'center', justifyContent: 'center' },
});
