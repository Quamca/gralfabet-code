import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Modal, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleTile } from '../components/ModuleTile';
import { getAllModules } from '../exercises/registry';
import { useAppStore } from '../store/useAppStore';

const BG           = require('../assets/images/shared/home-background.png') as number;
const BG_RIGHT     = require('../assets/images/shared/home-background-right.png') as number;
const SCORE_ICON   = require('../assets/images/shared/score.png') as number;
const LESSONS_ICON = require('../assets/images/shared/lessons.png') as number;
const OPTIONS_ICON = require('../assets/images/shared/options.png') as number;

const modules = getAllModules();

const TILE_MARGIN      = 8;
const CONTAINER_H_PAD  = 16;
const SIDE_BTN_SIZE    = 110;
const LESSONS_BTN_SIZE = 150;
const BAR_HEIGHT       = 160;

export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const childName = useAppStore((s) => s.childName);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const tileSize = Math.floor((width - CONTAINER_H_PAD * 2 - TILE_MARGIN * 4) / 2);

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOptionsIn = () => {
    setOptionsModalVisible(true);
    pressTimer.current = setTimeout(() => {
      setOptionsModalVisible(false);
      router.push('/settings');
    }, 5000);
  };

  const handleOptionsOut = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setOptionsModalVisible(false);
  };

  const waveRotation = useSharedValue(0);
  useEffect(() => {
    waveRotation.value = withSequence(
      withTiming(22, { duration: 280 }),
      withTiming(-10, { duration: 280 }),
      withTiming(22, { duration: 280 }),
      withTiming(0,  { duration: 360 }),
    );
  }, []);
  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  if (!hasHydrated) return null;
  if (!childName) return <Redirect href="/setup" />;

  const barBottom = insets.bottom + 24;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: insets.top + 80, paddingBottom: BAR_HEIGHT + insets.bottom }]}>
        <View style={styles.greeting}>
          <Animated.View style={waveStyle}>
            <Text style={styles.greetingEmoji}>👋</Text>
          </Animated.View>
          <Text style={styles.greetingName}>{childName}</Text>
        </View>

        <View style={styles.grid}>
          {modules.map((mod) => (
            <ModuleTile key={mod.id} module={mod} size={tileSize} />
          ))}
        </View>
      </View>

      <ImageBackground source={BG_RIGHT} style={[styles.bottomBar, { paddingBottom: barBottom }]} resizeMode="cover">
        <TouchableOpacity onPress={() => router.push('/score')} accessibilityLabel="Postępy">
          <Image source={SCORE_ICON} style={styles.sideBtn} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.lessonsWrapper} onPress={() => router.push('/lessons')} accessibilityLabel="Lekcje">
          <Image source={LESSONS_ICON} style={styles.lessonsBtn} />
        </TouchableOpacity>

        <Pressable
          onPressIn={handleOptionsIn}
          onPressOut={handleOptionsOut}
          accessibilityLabel="Opcje dla rodzica"
        >
          <Image source={OPTIONS_ICON} style={styles.sideBtn} />
        </Pressable>
      </ImageBackground>

      <Modal visible={optionsModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay} pointerEvents="none">
          <View style={[styles.modalBox, { marginBottom: barBottom + 24 + LESSONS_BTN_SIZE + 16 }]}>
            <Text style={styles.modalText}>
              Przytrzymaj przez 5 sekund,{'\n'}żeby wejść do ustawień
            </Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: CONTAINER_H_PAD,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 14,
  },
  greetingEmoji: {
    fontSize: 56,
  },
  greetingName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  sideBtn: {
    width: SIDE_BTN_SIZE,
    height: SIDE_BTN_SIZE,
    resizeMode: 'contain',
  },
  lessonsWrapper: {
    marginBottom: 24,
  },
  lessonsBtn: {
    width: LESSONS_BTN_SIZE,
    height: LESSONS_BTN_SIZE,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalText: {
    fontSize: 20,
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 30,
  },
});
