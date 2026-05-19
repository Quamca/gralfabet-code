import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function SetupScreen() {
  const [name, setName] = useState('');
  const setChildName = useAppStore((s) => s.setChildName);
  const router = useRouter();

  const trimmed = name.trim();

  const handleConfirm = () => {
    if (!trimmed) return;
    setChildName(trimmed);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kto gra?</Text>
      <TextInput
        style={styles.input}
        placeholder="Wpisz imię"
        value={name}
        onChangeText={setName}
        autoFocus
        maxLength={30}
        returnKeyType="done"
        onSubmitEditing={handleConfirm}
      />
      <TouchableOpacity
        style={[styles.confirmButton, !trimmed && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={!trimmed}
        accessibilityLabel="Zatwierdź imię i zacznij grać"
        accessibilityRole="button"
      >
        <Text style={styles.confirmIcon}>✓</Text>
      </TouchableOpacity>
    </View>
  );
}

const CONFIRM_BUTTON_SIZE = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    fontSize: 28,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  confirmButton: {
    width: CONFIRM_BUTTON_SIZE,
    height: CONFIRM_BUTTON_SIZE,
    borderRadius: CONFIRM_BUTTON_SIZE / 2,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  confirmIcon: {
    fontSize: 44,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 54,
  },
});
