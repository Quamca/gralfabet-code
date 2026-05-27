import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EXIT_ICON = require('../assets/images/shared/exit-button.png') as number;

export default function ScoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Postępy</Text>
        <Text style={styles.subtitle}>Tutaj wkrótce pojawią się{'\n'}osiągnięcia i statystyki</Text>
      </View>

      <TouchableOpacity onPress={() => router.replace('/')} accessibilityLabel="Wróć do menu">
        <Image source={EXIT_ICON} style={styles.homeBtn} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    lineHeight: 30,
  },
  homeBtn: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
