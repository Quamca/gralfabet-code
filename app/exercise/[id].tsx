import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getModule } from '../../exercises/registry';
import { useAppStore } from '../../store/useAppStore';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const setLastOpenedLetter = useAppStore((s) => s.setLastOpenedLetter);

  const moduleId = Array.isArray(id) ? id[0] : id ?? '';
  const mod = getModule(moduleId);

  const handleDone = () => {
    setLastOpenedLetter(moduleId);
    router.back();
  };

  if (mod) {
    const ExerciseComponent = mod.component;
    return <ExerciseComponent />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ćwiczenie: {moduleId}</Text>
      <TouchableOpacity style={styles.button} onPress={handleDone}>
        <Text style={styles.buttonText}>Gotowe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { fontSize: 20, marginBottom: 32, color: '#333' },
  button: { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
