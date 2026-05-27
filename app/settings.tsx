import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

const EXIT_ICON = require('../assets/images/shared/exit-button.png') as number;
const BG        = require('../assets/images/shared/home-background-right.png') as number;

export default function SettingsScreen() {
  const childName    = useAppStore((s) => s.childName);
  const setChildName = useAppStore((s) => s.setChildName);
  const clearProfile = useAppStore((s) => s.clearProfile);
  const router = useRouter();

  const insets = useSafeAreaInsets();
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
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.content}>
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
      </View>

      <TouchableOpacity onPress={() => router.replace('/')} accessibilityLabel="Wróć do menu">
        <Image source={EXIT_ICON} style={styles.homeBtn} />
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  homeBtn: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
