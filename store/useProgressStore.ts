import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const POLISH_LETTERS = [
  'a', 'ą', 'b', 'c', 'ć', 'd', 'e', 'ę', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'ł',
  'm', 'n', 'ń', 'o', 'ó', 'p', 'r', 's', 'ś', 't', 'u', 'w', 'y', 'z', 'ź', 'ż',
];

type LetterOutcome = 'first-try' | 'second-try' | 'auto-reveal';
type LetterStats = { correct: number; errors: number; streak: number };

const DEFAULT_STATS: LetterStats = { correct: 0, errors: 0, streak: 0 };

function initLetters(): Record<string, LetterStats> {
  return Object.fromEntries(POLISH_LETTERS.map((l) => [l, { ...DEFAULT_STATS }]));
}

function weightedSample(pool: string[], weights: number[], n: number): string[] {
  const remaining = [...pool];
  const remainingWeights = [...weights];
  const result: string[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const total = remainingWeights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = remainingWeights.length - 1;
    for (let j = 0; j < remainingWeights.length; j++) {
      r -= remainingWeights[j];
      if (r <= 0) { idx = j; break; }
    }
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
    remainingWeights.splice(idx, 1);
  }
  return result;
}

function uniformSample(pool: string[], n: number): string[] {
  const remaining = [...pool];
  const result: string[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return result;
}

interface ProgressState {
  letters: Record<string, LetterStats>;
  _hasHydrated: boolean;
  updateLetter: (id: string, outcome: LetterOutcome) => void;
  selectLetters: (count: number) => string[];
  getLetterStats: (id: string) => LetterStats;
  setHasHydrated: (value: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      letters: initLetters(),
      _hasHydrated: false,

      updateLetter: (id, outcome) =>
        set((state) => {
          const prev = state.letters[id] ?? { ...DEFAULT_STATS };
          let next: LetterStats;
          if (outcome === 'first-try') {
            next = { ...prev, correct: prev.correct + 1, streak: prev.streak + 1 };
          } else if (outcome === 'second-try') {
            next = { ...prev, correct: prev.correct + 1, errors: prev.errors + 1 };
          } else {
            next = { ...prev, streak: 0 };
          }
          return { letters: { ...state.letters, [id]: next } };
        }),

      selectLetters: (count) => {
        const { letters } = get();
        const hard = POLISH_LETTERS.filter((l) => (letters[l]?.streak ?? 0) < 3);
        const easy = POLISH_LETTERS.filter((l) => (letters[l]?.streak ?? 0) >= 3);

        const hardTarget = Math.ceil(count * 0.6);
        const easyTarget = count - hardTarget;

        const hardPick = weightedSample(
          hard,
          hard.map((l) => 1 / ((letters[l]?.streak ?? 0) + 1)),
          hardTarget,
        );

        const easyPick = uniformSample(
          easy.filter((l) => !hardPick.includes(l)),
          easyTarget,
        );

        const result = [...hardPick, ...easyPick];

        if (result.length < count) {
          const used = new Set(result);
          const remaining = POLISH_LETTERS.filter((l) => !used.has(l));
          result.push(...uniformSample(remaining, count - result.length));
        }

        return result;
      },

      getLetterStats: (id) => get().letters[id] ?? { ...DEFAULT_STATS },

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'gralfabet-progress',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ letters: state.letters }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
