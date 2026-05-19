import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppStore {
  lastOpenedLetterId: string | null;
  setLastOpenedLetter: (id: string) => void;
  childName: string | null;
  setChildName: (name: string) => void;
  clearProfile: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      lastOpenedLetterId: null,
      setLastOpenedLetter: (id) => set({ lastOpenedLetterId: id }),
      childName: null,
      setChildName: (name) => set({ childName: name }),
      clearProfile: () => set({ childName: null }),
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'gralfabet-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastOpenedLetterId: state.lastOpenedLetterId,
        childName: state.childName,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
