import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const childName = useAppStore((s) => s.childName);
  const lastOpenedLetterId = useAppStore((s) => s.lastOpenedLetterId);

  if (!hasHydrated) return null;

  if (!childName) {
    return <Redirect href="/setup" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cześć, {childName}!</Text>
      {lastOpenedLetterId ? (
        <Text style={styles.subtitle}>Ostatnia litera: {lastOpenedLetterId}</Text>
      ) : null}
      <Link href="/exercise/A" style={styles.link}>
        Ćwiczenie: litera A
      </Link>
      <Link href="/settings" style={styles.settingsLink}>
        Ustawienia
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#555',
  },
  link: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 8,
  },
  settingsLink: {
    fontSize: 14,
    color: '#888',
    marginTop: 32,
  },
});
