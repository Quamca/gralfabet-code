import { ImageSourcePropType } from 'react-native';

export interface ExerciseModule {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  component: React.ComponentType;
  audioLabel: number;
  tileColor?: string;
}
