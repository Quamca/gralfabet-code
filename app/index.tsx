import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ModuleTile } from '../components/ModuleTile';
import { getAllModules } from '../exercises/registry';
import { useAppStore } from '../store/useAppStore';

const modules = getAllModules();

export default function HomeScreen() {
  const hasHydrated = useAppStore((s) => s._hasHydrated);
  const childName = useAppStore((s) => s.childName);

  if (!hasHydrated) return null;
  if (!childName) return <Redirect href="/setup" />;

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingEmoji}>👋</Text>
        <Text style={styles.greetingName}>{childName}</Text>
      </View>

      <View style={styles.grid}>
        {modules.map((mod) => (
          <ModuleTile key={mod.id} module={mod} />
        ))}
      </View>

      <Link href="/settings" style={styles.settingsLink} accessibilityLabel="Ustawienia">
        ⚙️
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    gap: 12,
  },
  greetingEmoji: {
    fontSize: 40,
  },
  greetingName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
  },
  settingsLink: {
    fontSize: 28,
    paddingBottom: 32,
  },
});
