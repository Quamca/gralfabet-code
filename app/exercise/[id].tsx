import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../../store/useAppStore';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const setLastOpenedLetter = useAppStore((s) => s.setLastOpenedLetter);

  const letterId = Array.isArray(id) ? id[0] : id ?? '';

  const handleDone = () => {
    setLastOpenedLetter(letterId);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{letterId}</Text>
      <Text style={styles.label}>Ćwiczenie: litera {letterId}</Text>
      <TouchableOpacity style={styles.button} onPress={handleDone}>
        <Text style={styles.buttonText}>Gotowe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  letter: {
    fontSize: 128,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    marginBottom: 32,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
