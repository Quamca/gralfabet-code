import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useAudioSequence } from '../../hooks/useAudioSequence';
import { CONTAINER_PAD, CORRECT_BG, CORRECT_BORDER, SCREEN_BG } from '../shared/tokens';
import type { CollectedDrawing } from './useRoundState';
import { DrawingCard } from './DrawingCard';
import { LETTERS } from './audio-letters';

const EXIT_ICON       = require('../../assets/images/shared/exit-button.png') as number;
const PLAY_AGAIN_ICON = require('../../assets/images/shared/play-again-button.png') as number;

const RESULT_CARD_SIZE = 140;
const BUTTONS_DELAY_MS = 800;

interface Props {
  drawings:    CollectedDrawing[];
  onPlayAgain: () => void;
  onExit:      () => void;
}

export function ResultScreen({ drawings, onPlayAgain, onExit }: Props): React.ReactElement {
  const [shownCount,     setShownCount]     = useState(0);
  const [buttonsVisible, setButtonsVisible] = useState(drawings.length === 0);
  const { playSequence, cancel } = useAudioSequence();

  useEffect(() => {
    if (shownCount >= drawings.length) return;

    let cancelled = false;
    const run = async () => {
      await playSequence([LETTERS[drawings[shownCount].letter.toLowerCase()]]);
      if (cancelled) return;
      setShownCount(c => c + 1);
    };

    void run();
    return () => { cancelled = true; cancel(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownCount, drawings]);

  useEffect(() => {
    if (shownCount < drawings.length || drawings.length === 0) return;
    const t = setTimeout(() => setButtonsVisible(true), BUTTONS_DELAY_MS);
    return () => clearTimeout(t);
  }, [shownCount, drawings.length]);

  const hasDrawings = drawings.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Narysowane literki</Text>

        {hasDrawings ? (
          <View style={styles.grid}>
            {drawings.map((d, i) =>
              i <= shownCount ? (
                <Animated.View key={i} entering={ZoomIn} style={styles.card}>
                  <DrawingCard drawing={d} size={RESULT_CARD_SIZE} />
                </Animated.View>
              ) : (
                <View key={i} style={[styles.card, styles.cardHidden]} />
              )
            )}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7}>
              <Image source={PLAY_AGAIN_ICON} style={styles.btnIconLarge} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.bottom} pointerEvents={buttonsVisible ? 'auto' : 'none'}>
        <View style={[styles.bottomInner, !buttonsVisible && styles.hidden]}>
          {hasDrawings && (
            <TouchableOpacity onPress={onPlayAgain} activeOpacity={0.7}>
              <Image source={PLAY_AGAIN_ICON} style={styles.btnIcon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onExit} activeOpacity={0.7}>
            <Image source={EXIT_ICON} style={styles.btnIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: SCREEN_BG, padding: CONTAINER_PAD },
  content:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 24 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  card:         { width: RESULT_CARD_SIZE, height: RESULT_CARD_SIZE, backgroundColor: CORRECT_BG, borderRadius: 16, borderWidth: 2, borderColor: CORRECT_BORDER },
  cardHidden:   { opacity: 0 },
  emptySection: { alignItems: 'center' },
  bottom:       { paddingVertical: 20 },
  bottomInner:  { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  hidden:       { opacity: 0 },
  btnIcon:      { width: 80, height: 80, resizeMode: 'contain' },
  btnIconLarge: { width: 112, height: 112, resizeMode: 'contain' },
});
