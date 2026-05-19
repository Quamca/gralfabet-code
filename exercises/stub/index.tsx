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

const stubModule: ExerciseModule = {
  id: 'stub',
  name: 'Stub',
  icon: { uri: '' },
  component: StubExercise,
  audioLabel: 'stub',
};

export default stubModule;
