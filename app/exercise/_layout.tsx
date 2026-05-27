import { Slot } from 'expo-router';
import { AlignedBackground } from '../../components/AlignedBackground';

const BG = require('../../assets/images/shared/home-background-left.png') as number;

export default function ExerciseLayout() {
  return (
    <AlignedBackground source={BG} align="right">
      <Slot />
    </AlignedBackground>
  );
}
