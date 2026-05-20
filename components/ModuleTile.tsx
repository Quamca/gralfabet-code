import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExerciseModule } from '../exercises/types';
import { useAudio } from '../hooks/useAudio';

interface Props {
  module: ExerciseModule;
}

export function ModuleTile({ module }: Props) {
  const router = useRouter();
  const { play } = useAudio(module.audioLabel);

  const handlePress = async () => {
    await play();
    router.push(`/exercise/${module.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: module.tileColor ?? '#E8F4FD' }]}
      onPress={handlePress}
      accessibilityLabel={module.name}
      accessibilityRole="button"
    >
      <View style={styles.iconBox}>
        <Image source={module.icon} style={styles.iconImage} />
      </View>
    </TouchableOpacity>
  );
}

const TILE_SIZE = 120;
const ICON_SIZE = 80;

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 48,
    height: 48,
  },
});
