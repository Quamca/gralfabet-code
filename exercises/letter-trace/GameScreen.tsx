import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Canvas, Circle, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import { SCREEN_BG } from '../shared/tokens';
import { LETTERS, type LetterEntry } from './letter-data';

const ROUNDS_PER_SESSION = 5;
const LETTER_FONT_SIZE   = 200;
const START_POINT_RADIUS = 14;

function sampleLetters(count: number): LetterEntry[] {
  return [...LETTERS].sort(() => Math.random() - 0.5).slice(0, count);
}

interface Props {
  onComplete: () => void;
  onExit:     () => void;
}

export function GameScreen({ onComplete, onExit }: Props): React.ReactElement {
  const { width, height } = useWindowDimensions();
  const [roundLetters]    = useState(() => sampleLetters(ROUNDS_PER_SESSION));
  const [roundIndex, setRoundIndex] = useState(0);

  // 'sans-serif' is a valid Android font family; default 'System' returns null on Android
  const font        = useMemo(() => matchFont({ fontFamily: 'sans-serif', fontSize: LETTER_FONT_SIZE }), []);
  const canvasSize  = Math.min(width, height) * 0.75;
  const currentEntry = roundLetters[roundIndex];

  // Baseline hard-coded at 78% of canvas — measureText y is unreliable on Android when typeface is null
  const letterY = canvasSize * 0.78;

  const letterPos = useMemo(() => {
    if (!font) return { x: canvasSize * 0.1, y: letterY };
    const b = font.measureText(currentEntry.letter);
    const x = b.width > 0
      ? canvasSize / 2 - b.x - b.width / 2
      : canvasSize * 0.1;
    return { x, y: letterY };
  }, [font, currentEntry.letter, canvasSize, letterY]);

  const startPoint = useMemo(() => {
    if (!font) return { x: canvasSize * 0.2, y: letterY - LETTER_FONT_SIZE * 0.8 };
    const b = font.measureText(currentEntry.letter);
    const safeWidth = b.width > 0 ? b.width : LETTER_FONT_SIZE * 0.6;
    return {
      x: letterPos.x + safeWidth * 0.2,
      y: letterY - LETTER_FONT_SIZE * 0.8,
    };
  }, [font, currentEntry.letter, canvasSize, letterPos, letterY]);

  function handleNext() {
    if (roundIndex < ROUNDS_PER_SESSION - 1) {
      setRoundIndex(r => r + 1);
    } else {
      onComplete();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.round}>Litera {roundIndex + 1} / {ROUNDS_PER_SESSION}</Text>
      <Canvas style={{ width: canvasSize, height: canvasSize }}>
        <SkiaText
          text={currentEntry.letter}
          x={letterPos.x}
          y={letterPos.y}
          font={font}
          color="#2C3E50"
        />
        <Circle cx={startPoint.x} cy={startPoint.y} r={START_POINT_RADIUS} color="#E74C3C" />
      </Canvas>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleNext} activeOpacity={0.7} style={styles.nextBtn}>
          <Text style={styles.nextText}>
            {roundIndex < ROUNDS_PER_SESSION - 1 ? 'Następna →' : 'Wyniki →'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onExit} activeOpacity={0.7} style={styles.exitBtn}>
          <Text style={styles.exitText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SCREEN_BG, alignItems: 'center', justifyContent: 'center', padding: 20 },
  round:     { fontSize: 20, color: '#666', marginBottom: 16 },
  buttons:   { flexDirection: 'row', gap: 24, marginTop: 24 },
  nextBtn:   { backgroundColor: '#4CAF50', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  nextText:  { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  exitBtn:   { backgroundColor: '#90A4AE', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  exitText:  { fontSize: 18, color: '#fff' },
});
