import { useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ExerciseModule } from '../exercises/types';

const DEFAULT_TILE_SIZE = 120;

const PRESS_DURATION  = 120;
const FADE_DURATION   = 150;
const NAV_DELAY_MS    = PRESS_DURATION + FADE_DURATION;

interface Props {
  module: ExerciseModule;
  size?: number;
}

export function ModuleTile({ module, size = DEFAULT_TILE_SIZE }: Props) {
  const router   = useRouter();
  const iconSize = Math.round(size * 0.9);
  const scale    = useSharedValue(1);
  const opacity  = useSharedValue(1);

  const navigate = () => router.push(`/exercise/${module.id}`);

  const gesture = Gesture.Tap().onBegin(() => {
    scale.value   = withTiming(0.88, { duration: PRESS_DURATION });
    opacity.value = withSequence(
      withTiming(1,    { duration: PRESS_DURATION }),
      withTiming(0,    { duration: FADE_DURATION }, () => { runOnJS(navigate)(); }),
    );
  });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity:   opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.tile,
          { backgroundColor: module.tileColor ?? '#E8F4FD', width: size, height: size },
          animStyle,
        ]}
        accessibilityLabel={module.name}
        accessibilityRole="button"
      >
        <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={module.icon} style={styles.iconImage} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tile: {
    margin: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
