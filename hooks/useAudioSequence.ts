import { Audio } from 'expo-av';
import { useCallback, useRef } from 'react';

export function useAudioSequence() {
  const cancelledRef = useRef(false);
  const currentSoundRef = useRef<Audio.Sound | null>(null);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    void currentSoundRef.current?.stopAsync();
  }, []);

  const playSequence = useCallback(async (sounds: number[]): Promise<void> => {
    cancelledRef.current = false;

    for (const assetId of sounds) {
      if (cancelledRef.current) break;

      let sound: Audio.Sound | null = null;
      try {
        const { sound: s } = await Audio.Sound.createAsync(assetId, { shouldPlay: true });
        sound = s;
        currentSoundRef.current = s;

        if (!cancelledRef.current) {
          await new Promise<void>((resolve) => {
            s.setOnPlaybackStatusUpdate((status) => {
              if (!status.isLoaded || status.didJustFinish || cancelledRef.current) {
                resolve();
              }
            });
          });
        }
      } catch {
        // Silently ignore — missing asset or platform error
      } finally {
        if (sound) {
          try { await sound.unloadAsync(); } catch { /* ignore */ }
        }
        if (currentSoundRef.current === sound) {
          currentSoundRef.current = null;
        }
      }
    }
  }, []);

  return { playSequence, cancel };
}
