# Exercise Module Design Rules

Read this before building a new module — do not analyse previous modules instead.

## Colors → `exercises/shared/tokens.ts`

| Semantic       | Token          | Hex     |
|----------------|----------------|---------|
| Background     | SCREEN_BG      | #FFFDE7 |
| Correct        | CORRECT_BG     | #C8E6C9 |
| Correct border | CORRECT_BORDER | #43A047 |
| Wrong          | WRONG_BG       | #FFCDD2 |
| Wrong border   | WRONG_BORDER   | #E53935 |
| Default tile   | DEFAULT_BG     | #FFF3CD |
| Default border | DEFAULT_BORDER | #E8C83A |
| Content pad    | CONTAINER_PAD  | 24px    |

## Timings → `exercises/shared/timings.ts`

| Constant         | Value | Purpose                                       |
|------------------|-------|-----------------------------------------------|
| HINT_DELAY_MS    | 1500  | Wait after 2nd wrong before showing hint     |
| REVEAL_STABLE_MS | 350   | Hold correct state visible before fading out |
| FADE_OUT_MS      | 300   | Duration of tile/hint opacity fade-out       |

## Game Constants → `exercises/shared/gameConstants.ts`

- `TOTAL_ROUNDS = 5` — rounds per session
- `pickTiles(target, allLetters)` — returns `[target, ...3 random distractors]`, shuffled

## Audio Pattern

1. **Round 0:** full instruction audio (module label + "Znajdź X jak słowo" or "X jak słowo")
2. **Round 1+:** short audio ("X jak słowo" without "Znajdź" prefix)
3. **After correct answer:** subject/word audio plays, then "dobrze"
4. **After wrong answer:** TRY_AGAIN audio plays
5. **Replay button:** re-plays current round instruction (short form)

## Error Flow

```
Tap correct → 'first-try' → collectible flies to fan → advance()
Tap wrong   → tile red + TRY_AGAIN → errors++
Tap wrong 2 → tiles fade to 0.3 + hint shows (green, pulsing)
  → HINT_DELAY_MS later → hint fades (FADE_OUT_MS) → advance()
  → Outcome: 'auto-reveal' — collectible NOT added to fan
```

## Layout

- **Fan zone:** top of content area, items stacked with STACK_PEEK offset
- **Replay button:** centered, above tile grid, `marginBottom: 16`
- **Tile grid:** 2 columns, 16px gap, centered horizontally
- **Exit button:** bottom of screen, always visible
- **Safe area:** `useSafeAreaInsets()` offsets content from status bar

## Calm UX Principles

- No time limits, no on-screen score counters
- Large hit targets — each tile fills ~half screen width
- One challenge element per round (one letter to find / one gap to fill)
- Audio-first: game must be playable without reading
- No punishing feedback — wrong tap = quiet red highlight only
- Hint always shows the correct answer — child never stays stuck
- Collect and progress, never score and judge
