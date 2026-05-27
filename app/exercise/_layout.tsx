import { Slot } from 'expo-router';
import { ImageBackground, StyleSheet } from 'react-native';

const BG = require('../../assets/images/shared/home-background-left.png') as number;

export default function ExerciseLayout() {
  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <Slot />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
});
