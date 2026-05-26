import { useRef, useState } from 'react';
import type { SkPath } from '@shopify/react-native-skia';
import type { GridPoint } from './letter-trace-utils';
import {
  COVERAGE_THRESHOLD,
  computeCoverage,
  isFail,
  markCoveredCells,
} from './letter-trace-utils';

export type RoundOutcome = 'success' | 'auto-reveal';
export type Phase = 'idle' | 'drawing' | 'success' | 'revealed';

export type StrokePoint = { x: number; y: number; newStroke?: boolean };

export type CollectedDrawing = {
  letter:       string;
  strokePoints: ReadonlyArray<StrokePoint>;
  canvasSize:   number;
};

export interface RoundRefs {
  letterPathRef: React.MutableRefObject<SkPath | null>;
  letterGridRef: React.MutableRefObject<GridPoint[]>;
}

export interface RoundStateReturn extends RoundRefs {
  roundIndex:    number;
  phase:         Phase;
  renderTick:    number;
  strokeRef:     React.MutableRefObject<StrokePoint[]>;
  onBeginStroke: (x: number, y: number) => void;
  onPoint:       (x: number, y: number) => void;
  onStrokeEnd:   () => void;
}

const ROUNDS_PER_SESSION = 5;
const FAIL_LIMIT         = 2;
const FAIL_COOLDOWN_MS   = 1200;
const SUCCESS_HOLD_MS    = 1700;

export function useRoundState(
  onComplete: (outcomes: RoundOutcome[]) => void,
  options?: {
    onRoundSuccess?: (roundIndex: number, points: ReadonlyArray<StrokePoint>) => void;
    onFail?: () => void;
  },
): RoundStateReturn {
  const roundIndexRef = useRef(0);
  const phaseRef      = useRef<Phase>('idle');
  const failCountRef  = useRef(0);
  const outcomesRef   = useRef<RoundOutcome[]>([]);
  const insideRef     = useRef(0);
  const outsideRef    = useRef(0);
  const coveredRef    = useRef(new Set<number>());
  const strokeRef     = useRef<StrokePoint[]>([]);
  const letterPathRef = useRef<SkPath | null>(null);
  const letterGridRef = useRef<GridPoint[]>([]);
  const failLockRef   = useRef(false);

  const [roundIndex, setRoundIndex] = useState(0);
  const [phase,      setPhase]      = useState<Phase>('idle');
  const [renderTick, setRenderTick] = useState(0);

  function resetStroke() {
    strokeRef.current  = [];
    insideRef.current  = 0;
    outsideRef.current = 0;
    coveredRef.current = new Set();
    setRenderTick(t => t + 1);
  }

  function advanceRound(nextOutcomes: RoundOutcome[]) {
    const next = roundIndexRef.current + 1;
    if (next >= ROUNDS_PER_SESSION) { onComplete(nextOutcomes); return; }
    roundIndexRef.current = next;
    failCountRef.current  = 0;
    phaseRef.current      = 'idle';
    setRoundIndex(next);
    setPhase('idle');
    resetStroke();
  }

  function handleFail() {
    const newFail = failCountRef.current + 1;
    failCountRef.current = newFail;
    if (newFail >= FAIL_LIMIT) {
      phaseRef.current = 'revealed';
      setPhase('revealed');
      const next = [...outcomesRef.current, 'auto-reveal' as RoundOutcome];
      outcomesRef.current = next;
      setTimeout(() => advanceRound(next), 1500);
    } else {
      options?.onFail?.();
      phaseRef.current = 'idle';
      setPhase('idle');
      resetStroke();
      failLockRef.current = true;
      setTimeout(() => { failLockRef.current = false; }, FAIL_COOLDOWN_MS);
    }
  }

  function onBeginStroke(x: number, y: number) {
    if (phaseRef.current === 'success' || phaseRef.current === 'revealed') return;
    if (failLockRef.current) return;
    strokeRef.current = [...strokeRef.current, { x, y, newStroke: true }];
    phaseRef.current = 'drawing';
    setRenderTick(t => t + 1);
  }

  function onPoint(x: number, y: number) {
    if (phaseRef.current === 'success' || phaseRef.current === 'revealed') return;
    if (failLockRef.current) return;
    strokeRef.current = [...strokeRef.current, { x, y }];
    const path = letterPathRef.current;
    const grid = letterGridRef.current;
    if (path) {
      if (path.contains(x, y)) {
        insideRef.current++;
        markCoveredCells(coveredRef.current, grid, x, y);
      } else {
        outsideRef.current++;
      }
    }
    phaseRef.current = 'drawing';
    setRenderTick(t => t + 1);
    if (isFail(insideRef.current, outsideRef.current)) handleFail();
  }

  function onStrokeEnd() {
    if (phaseRef.current !== 'drawing') return;
    const grid = letterGridRef.current;
    const cov  = computeCoverage(coveredRef.current, grid.length);
    if (cov >= COVERAGE_THRESHOLD) {
      phaseRef.current = 'success';
      setPhase('success');
      const next = [...outcomesRef.current, 'success' as RoundOutcome];
      outcomesRef.current = next;
      options?.onRoundSuccess?.(roundIndexRef.current, [...strokeRef.current]);
      setTimeout(() => advanceRound(next), SUCCESS_HOLD_MS);
    }
  }

  return {
    roundIndex, phase, renderTick,
    strokeRef, letterPathRef, letterGridRef,
    onBeginStroke, onPoint, onStrokeEnd,
  };
}
