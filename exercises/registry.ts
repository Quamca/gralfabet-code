import { ExerciseModule } from './types';
import findTheLetterModule from './find-the-letter';
import missingLetterModule from './missing-letter';
import letterTraceModule from './letter-trace';

const registry: Record<string, ExerciseModule> = {
  [findTheLetterModule.id]: findTheLetterModule,
  [missingLetterModule.id]: missingLetterModule,
  [letterTraceModule.id]:   letterTraceModule,
};

export function getModule(id: string): ExerciseModule | undefined {
  return registry[id];
}

export function getAllModules(): ExerciseModule[] {
  return Object.values(registry);
}
