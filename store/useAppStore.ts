import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStore {
  lastOpenedLetterId: string | null;
  setLastOpenedLetter: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      lastOpenedLetterId: null,
      setLastOpenedLetter: (id) => set({ lastOpenedLetterId: id }),
    }),
    {
      name: 'gralfabet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
