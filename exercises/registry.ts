import { ExerciseModule } from './types';
import stubModule from './stub';

const registry: Record<string, ExerciseModule> = {
  [stubModule.id]: stubModule,
};

export function getModule(id: string): ExerciseModule | undefined {
  return registry[id];
}

export function getAllModules(): ExerciseModule[] {
  return Object.values(registry);
}
