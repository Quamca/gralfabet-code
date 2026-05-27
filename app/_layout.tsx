import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen
          name="index"
          options={({ route }) => ({
            animation: (route.params as Record<string, string> | undefined)?.exit === '1'
              ? 'slide_from_left'
              : 'slide_from_right',
          })}
        />
        <Stack.Screen name="score"    options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_left' }} />
        <Stack.Screen name="lessons"  options={{ animation: 'slide_from_left' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
