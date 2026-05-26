export const GRID_STEP = 15;
export const COVERAGE_RADIUS = GRID_STEP * 1.4;
export const COVERAGE_THRESHOLD = 0.65;
export const FAIL_MIN_POINTS = 10;

export interface GridPoint { x: number; y: number; }

export function buildLetterGrid(
  contains: (x: number, y: number) => boolean,
  boundsLeft: number,
  boundsTop: number,
  boundsWidth: number,
  boundsHeight: number
): GridPoint[] {
  const result: GridPoint[] = [];
  const right  = boundsLeft + boundsWidth;
  const bottom = boundsTop  + boundsHeight;
  for (let gx = boundsLeft; gx <= right;  gx += GRID_STEP) {
    for (let gy = boundsTop;  gy <= bottom; gy += GRID_STEP) {
      if (contains(gx, gy)) result.push({ x: gx, y: gy });
    }
  }
  return result;
}

export function markCoveredCells(
  covered: Set<number>,
  grid: GridPoint[],
  px: number,
  py: number
): void {
  const r2 = COVERAGE_RADIUS * COVERAGE_RADIUS;
  for (let i = 0; i < grid.length; i++) {
    if (covered.has(i)) continue;
    const dx = grid[i].x - px;
    const dy = grid[i].y - py;
    if (dx * dx + dy * dy <= r2) covered.add(i);
  }
}

export function computeCoverage(covered: Set<number>, totalCells: number): number {
  return totalCells === 0 ? 1 : covered.size / totalCells;
}

export function isFail(inside: number, outside: number): boolean {
  return inside + outside >= FAIL_MIN_POINTS && outside > inside;
}
