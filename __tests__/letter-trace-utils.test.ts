import {
  buildLetterGrid,
  markCoveredCells,
  computeCoverage,
  isFail,
  FAIL_MIN_POINTS,
  COVERAGE_THRESHOLD,
  GRID_STEP,
  COVERAGE_RADIUS,
} from '../exercises/letter-trace/letter-trace-utils';

describe('buildLetterGrid', () => {
  it('includes points inside the letter', () => {
    const alwaysInside = () => true;
    const grid = buildLetterGrid(alwaysInside, 0, 0, GRID_STEP * 2, GRID_STEP * 2);
    expect(grid.length).toBeGreaterThan(0);
  });

  it('excludes points outside the letter', () => {
    const alwaysOutside = () => false;
    const grid = buildLetterGrid(alwaysOutside, 0, 0, 100, 100);
    expect(grid).toHaveLength(0);
  });

  it('samples at GRID_STEP intervals', () => {
    const alwaysInside = () => true;
    const grid = buildLetterGrid(alwaysInside, 0, 0, GRID_STEP, GRID_STEP);
    // 0,0 and 0,GRID_STEP and GRID_STEP,0 and GRID_STEP,GRID_STEP
    expect(grid).toHaveLength(4);
  });
});

describe('markCoveredCells', () => {
  it('marks cells within COVERAGE_RADIUS of stroke point', () => {
    const grid = [{ x: 10, y: 10 }, { x: 200, y: 200 }];
    const covered = new Set<number>();
    markCoveredCells(covered, grid, 10, 10);
    expect(covered.has(0)).toBe(true);
    expect(covered.has(1)).toBe(false);
  });

  it('does not re-process already covered cells', () => {
    const grid = [{ x: 10, y: 10 }];
    const covered = new Set<number>([0]);
    markCoveredCells(covered, grid, 10, 10);
    expect(covered.size).toBe(1);
  });
});

describe('computeCoverage', () => {
  it('returns 1 when totalCells is 0', () => {
    expect(computeCoverage(new Set(), 0)).toBe(1);
  });

  it('returns ratio of covered to total', () => {
    const covered = new Set([0, 1, 2]);
    expect(computeCoverage(covered, 4)).toBe(0.75);
  });

  it('returns 1 when all cells covered', () => {
    const covered = new Set([0, 1, 2, 3]);
    expect(computeCoverage(covered, 4)).toBe(1);
  });
});

describe('isFail', () => {
  it('returns false when not enough total points', () => {
    expect(isFail(0, FAIL_MIN_POINTS - 2)).toBe(false);
  });

  it('returns false when inside >= outside', () => {
    expect(isFail(10, FAIL_MIN_POINTS)).toBe(false);
  });

  it('returns true when outside > inside and enough total points', () => {
    expect(isFail(2, FAIL_MIN_POINTS)).toBe(true);
  });
});

describe('constants', () => {
  it('COVERAGE_THRESHOLD is between 0 and 1', () => {
    expect(COVERAGE_THRESHOLD).toBeGreaterThan(0);
    expect(COVERAGE_THRESHOLD).toBeLessThan(1);
  });

  it('COVERAGE_RADIUS is larger than half GRID_STEP', () => {
    expect(COVERAGE_RADIUS).toBeGreaterThan(GRID_STEP / 2);
  });
});
