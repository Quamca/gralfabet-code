# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

Issues are worked one at a time in order. For each issue:

1. Create a feature branch from `develop`
2. Implement, then `npx tsc --noEmit` — fix all errors before committing
3. Commit and push, open a PR against `develop`
4. **Wait for the user to say "zatwierdzam"** (or equivalent approval) before merging
5. On approval: merge PR with `--delete-branch`, pull `develop`, proceed to the next issue
6. Update `gralfabet-vault/00_START_HERE/CURRENT_STATE.md` when a sprint closes

**Git autonomy**: once the user approves ("zatwierdzam"), merge and continue without further confirmation. Do not ask again for the same action within the same issue.

**WIP rule**: if a file is modified but uncommitted at session start, check whether it belongs to a planned issue before creating a new branch — it may be unfinished work that just needs a commit.

## Commands

```bash
npx expo start                # start dev server (Expo Go on Android via QR)
npx expo start --android      # launch on connected Android device/emulator
npx expo start --ios          # launch on iOS simulator
npx tsc --noEmit              # type-check
npx jest --passWithNoTests    # run tests
eas build --profile development --platform android  # build local APK
```

## Architecture

The app is a Polish alphabet learning game for children. Navigation is file-based via Expo Router; all screens live under `app/`.

**Screens**
- `app/index.tsx` — home: `ImageBackground`, waving hand animation, `ModuleTile` grid (2 per row, size calculated from screen width), bottom nav bar with 3 image buttons. Guards hydration flash via `_hasHydrated`.
- `app/setup.tsx` — first-run name entry; writes `childName` and replaces to `/`.
- `app/settings.tsx` — parent options: editable child name (TextInput + save), reset profile button. Accessed only via 5-second hold on the options button on home.
- `app/score.tsx` — placeholder progress screen; home button returns to `/`.
- `app/exercise/[id].tsx` — looks up module by id in the registry and renders its component.

**Home bottom bar (`app/index.tsx`)**

Three image buttons at the bottom, absolutely positioned:
- `score.png` (left) → `/score`
- `lessons.png` (center, larger, elevated) → `/lessons` (stub — screen not yet created)
- `options.png` (right) → 5-second hold required; `Pressable` with `onPressIn`/`onPressOut`, modal appears immediately with hold instruction, navigates to `/settings` after 5 s

**Exercise module system** (`exercises/`)

Each module lives in its own folder and exports a default `ExerciseModule` object (`exercises/types.ts`):

```ts
{ id, name, icon, component, audioLabel?, tileColor? }
```

The root module component manages a `'playing' | 'result'` phase and renders `<GameScreen>` or `<ResultScreen>`. Modules register themselves in `exercises/registry.ts` — add an import and entry there to expose a new module on the home screen.

Current modules: `find-the-letter`, `missing-letter`, `letter-trace`.

**Design rules** — read `exercises/shared/DESIGN_RULES.md` before touching any exercise. It defines:
- Color tokens (`exercises/shared/tokens.ts`)
- Timing constants (`exercises/shared/timings.ts`)
- Game constants including `TOTAL_ROUNDS = 5` (`exercises/shared/gameConstants.ts`)
- Audio sequencing pattern (round-0 full instruction, round-1+ short)
- Error flow: wrong tap → red highlight → second wrong → hint auto-reveal (outcome `'auto-reveal'`, no collectible)
- Layout rules: fan zone top, tile grid 2 columns, exit button always `<Image>` never text, no round counter text

**State** (`store/useAppStore.ts`)

Zustand + AsyncStorage. Persisted fields: `childName`, `lastOpenedLetterId`. The `_hasHydrated` flag is set by `onRehydrateStorage` and must be true before any redirect logic runs.

**Audio** (`hooks/useAudio.ts`)

`useAudio(assetPath: number)` returns `{ play }`. Stops and unloads any previous sound before playing. Audio errors are silently ignored to avoid crashing on missing assets or platform issues.

**Drawing** (`letter-trace` module)

Uses `@shopify/react-native-skia` for canvas drawing. `CollectedDrawing.letter` stores the glyph as written (e.g. `'A'` or `'a'`); when looking up audio by letter use `.toLowerCase()`.

**Assets layout**

```
assets/
  images/shared/          # home-background.png, tile icons, UI buttons
  images/<module>/        # per-module tile icons and word images
  sounds/shared/letters/  # per-letter mp3s, named by lowercase letter
  sounds/shared/phrases/  # confirm.mp3, dobrze.mp3, try-again.mp3, …
  sounds/<module>/        # per-module instruction audio
```
