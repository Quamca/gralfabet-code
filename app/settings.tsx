import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const childName    = useAppStore((s) => s.childName);
  const setChildName = useAppStore((s) => s.setChildName);
  const clearProfile = useAppStore((s) => s.clearProfile);
  const router = useRouter();

  const [editName, setEditName] = useState(childName ?? '');
  const trimmed = editName.trim();

  const handleSave = () => {
    if (trimmed) setChildName(trimmed);
  };

  const handleChangeProfile = () => {
    clearProfile();
    router.replace('/setup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ustawienia</Text>

      <Text style={styles.label}>Imię dziecka</Text>
      <TextInput
        style={styles.input}
        value={editName}
        onChangeText={setEditName}
        maxLength={30}
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      <TouchableOpacity
        style={[styles.saveButton, !trimmed && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!trimmed}
        accessibilityLabel="Zapisz imię"
        accessibilityRole="button"
      >
        <Text style={styles.saveButtonText}>Zapisz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleChangeProfile}
        accessibilityLabel="Resetuj profil gracza"
        accessibilityRole="button"
      >
        <Text style={styles.changeButtonText}>Resetuj profil</Text>
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
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  changeButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#FF3B30',
    fontSize: 16,
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
