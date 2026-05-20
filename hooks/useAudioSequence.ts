import { Audio } from 'expo-av';
import { useCallback, useRef, useState } from 'react';

export function useAudioSequence() {
  const currentSoundRef = useRef<Audio.Sound | null>(null);
  const seqIdRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const cancel = useCallback(() => {
    seqIdRef.current += 1;
    setIsPlaying(false);
    void currentSoundRef.current?.stopAsync();
  }, []);

  const playSequence = useCallback(async (sounds: number[]): Promise<void> => {
    const myId = ++seqIdRef.current;
    setIsPlaying(true);

    for (const assetId of sounds) {
      if (seqIdRef.current !== myId) break;

      let sound: Audio.Sound | null = null;
      try {
        const { sound: s } = await Audio.Sound.createAsync(assetId, { shouldPlay: true });
        sound = s;
        currentSoundRef.current = s;

        if (seqIdRef.current === myId) {
          await new Promise<void>((resolve) => {
            s.setOnPlaybackStatusUpdate((status) => {
              if (!status.isLoaded || status.didJustFinish || seqIdRef.current !== myId) {
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

    if (seqIdRef.current === myId) {
      setIsPlaying(false);
    }
  }, []);

  return { playSequence, cancel, isPlaying };
}
