import { StyleSheet, Text, View } from 'react-native';
import { ExerciseModule } from '../types';

function StubExercise() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stub — ćwiczenie w budowie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: '#888' },
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const STUB_AUDIO = require('../../assets/sounds/test-beep.wav') as number;

const stubModule: ExerciseModule = {
  id: 'stub',
  name: 'Stub',
  icon: { uri: '' },
  component: StubExercise,
  audioLabel: STUB_AUDIO,
};

export default stubModule;
