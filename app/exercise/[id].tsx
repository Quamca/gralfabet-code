import { useLocalSearchParams, useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getModule } from '../../exercises/registry';

const BG = require('../../assets/images/shared/home-background-left.png') as number;

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const moduleId = Array.isArray(id) ? id[0] : id ?? '';
  const mod = getModule(moduleId);

  if (mod) {
    const ExerciseComponent = mod.component;
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <ExerciseComponent />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.fallback}>
      <Text style={styles.label}>Nieznany moduł</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Wróć</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bg:          { flex: 1, backgroundColor: '#D6EAF8' },
  fallback:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label:       { fontSize: 20, marginBottom: 32, color: '#333' },
  button:      { backgroundColor: '#007AFF', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  buttonText:  { color: '#fff', fontSize: 18, fontWeight: '600' },
});
