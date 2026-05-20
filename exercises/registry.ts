import { ExerciseModule } from './types';
import findTheLetterModule from './find-the-letter';

const registry: Record<string, ExerciseModule> = {
  [findTheLetterModule.id]: findTheLetterModule,
};

export function getModule(id: string): ExerciseModule | undefined {
  return registry[id];
}

export function getAllModules(): ExerciseModule[] {
  return Object.values(registry);
}
