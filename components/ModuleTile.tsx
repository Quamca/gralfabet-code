import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExerciseModule } from '../exercises/types';

const DEFAULT_TILE_SIZE = 120;

interface Props {
  module: ExerciseModule;
  size?: number;
}

export function ModuleTile({ module, size = DEFAULT_TILE_SIZE }: Props) {
  const router = useRouter();
  const iconSize = Math.round(size * 0.65);

  const handlePress = () => {
    router.push(`/exercise/${module.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: module.tileColor ?? '#E8F4FD', width: size, height: size }]}
      onPress={handlePress}
      accessibilityLabel={module.name}
      accessibilityRole="button"
    >
      <View style={{ width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={module.icon} style={styles.iconImage} />
      </View>
    </TouchableOpacity>
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
