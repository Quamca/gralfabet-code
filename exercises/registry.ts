import { ExerciseModule } from './types';
import findTheLetterModule from './find-the-letter';
import stubModule from './stub';

const registry: Record<string, ExerciseModule> = {
  [stubModule.id]: stubModule,
  [findTheLetterModule.id]: findTheLetterModule,
};

export function getModule(id: string): ExerciseModule | undefined {
  return registry[id];
}

export function getAllModules(): ExerciseModule[] {
  return Object.values(registry);
}
