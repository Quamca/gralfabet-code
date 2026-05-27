import { Slot } from 'expo-router';
import { AlignedBackground } from '../../components/AlignedBackground';

export default function ExerciseLayout() {
  return (
    <AlignedBackground panel="left">
      <Slot />
    </AlignedBackground>
  );
}
