import { Audio, AVPlaybackStatus } from 'expo-av';
import { useCallback, useRef } from 'react';

export function useAudio(assetPath: number) {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(assetPath, { shouldPlay: true });
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) {
          void sound.unloadAsync();
          if (soundRef.current === sound) soundRef.current = null;
        }
      });
    } catch {
      // Silently ignore — missing asset or platform error must not crash the app
    }
  }, [assetPath]);

  return { play };
}
