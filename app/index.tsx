import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModuleTile } from '../components/ModuleTile';
import { getAllModules } from '../exercises/registry';
import { useAppStore } from '../store/useAppStore';

const BG = require('../assets/images/shared/home-background.png') as number;

const modules = getAllModules();

const TILE_MARGIN = 8;
const CONTAINER_H_PAD = 16;

export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const childName = useAppStore((s) => s.childName);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const tileSize = Math.floor((width - CONTAINER_H_PAD * 2 - TILE_MARGIN * 4) / 2);

  const waveRotation = useSharedValue(0);
  useEffect(() => {
    waveRotation.value = withRepeat(
      withSequence(
        withTiming(22, { duration: 280 }),
        withTiming(-10, { duration: 280 }),
        withTiming(22, { duration: 280 }),
        withTiming(0,  { duration: 360 }),
        withTiming(0,  { duration: 1200 }),
      ),
      -1,
    );
  }, []);
  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  if (!hasHydrated) return null;
  if (!childName) return <Redirect href="/setup" />;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 100 }]}>
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
});
