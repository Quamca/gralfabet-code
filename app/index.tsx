import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function HomeScreen() {
  const lastOpenedLetterId = useAppStore((s) => s.lastOpenedLetterId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GrAlfabet</Text>
      {lastOpenedLetterId ? (
        <Text style={styles.subtitle}>Ostatnia litera: {lastOpenedLetterId}</Text>
      ) : null}
      <Link href="/exercise/A" style={styles.link}>
        Ćwiczenie: litera A
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
});
