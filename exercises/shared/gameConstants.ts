export const TOTAL_ROUNDS = 5;

export function pickTiles(target: string, allLetters: string[]): string[] {
  const pool = allLetters.filter((l) => l !== target);
  const distractors: string[] = [];
  while (distractors.length < 3) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!distractors.includes(pool[idx])) distractors.push(pool[idx]);
  }
  const tiles = [target, ...distractors];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}
