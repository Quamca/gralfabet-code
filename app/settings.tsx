import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const clearProfile = useAppStore((s) => s.clearProfile);
  const childName = useAppStore((s) => s.childName);
  const router = useRouter();

  const handleChangeProfile = () => {
    clearProfile();
    router.replace('/setup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ustawienia</Text>
      {childName ? (
        <Text style={styles.info}>Gracz: {childName}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleChangeProfile}
        accessibilityLabel="Zmień profil gracza"
        accessibilityRole="button"
      >
        <Text style={styles.changeButtonText}>Zmień profil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Wróć do menu"
        accessibilityRole="button"
      >
        <Text style={styles.backButtonText}>Wróć</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  info: {
    fontSize: 18,
    color: '#555',
    marginBottom: 32,
  },
  changeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
});
