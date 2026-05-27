import 'react-native-reanimated';
import { Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const HOME_BG  = require('../assets/images/shared/home-background.png') as number;
const GAME_BG  = require('../assets/images/shared/home-background-left.png') as number;
const SCORE_BG = require('../assets/images/shared/home-background-right.png') as number;

const FADE_MS = 280;

function BackgroundLayer() {
  const pathname = usePathname();
  const isGame  = pathname.startsWith('/exercise');
  const isScore = pathname === '/score' || pathname === '/settings' || pathname === '/lessons';

  const homeOp  = useSharedValue(1);
  const gameOp  = useSharedValue(0);
  const scoreOp = useSharedValue(0);

  useEffect(() => {
    homeOp.value  = withTiming(!isGame && !isScore ? 1 : 0, { duration: FADE_MS });
    gameOp.value  = withTiming(isGame  ? 1 : 0,             { duration: FADE_MS });
    scoreOp.value = withTiming(isScore ? 1 : 0,             { duration: FADE_MS });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGame, isScore]);

  const homeStyle  = useAnimatedStyle(() => ({ opacity: homeOp.value }));
  const gameStyle  = useAnimatedStyle(() => ({ opacity: gameOp.value }));
  const scoreStyle = useAnimatedStyle(() => ({ opacity: scoreOp.value }));

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, homeStyle]}>
        <Image source={HOME_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, gameStyle]}>
        <Image source={GAME_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, scoreStyle]}>
        <Image source={SCORE_BG} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </Animated.View>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <BackgroundLayer />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="score"    options={{ animation: 'slide_from_left' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_left' }} />
          <Stack.Screen name="lessons"  options={{ animation: 'slide_from_left' }} />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
