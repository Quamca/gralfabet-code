# GrAlfabet

Calm Polish alphabet learning app for children 6+. No ads, no FOMO, no noise.
Built with Expo + React Native (TypeScript), offline-first, modular exercise framework.

## Stack

- Mobile: Expo SDK + React Native + TypeScript
- Navigation: Expo Router
- State & storage: Zustand + AsyncStorage
- Audio: Expo AV
- Backend (lazy): Supabase
- Payments (lazy): RevenueCat
- Build: EAS Build

## Local setup

```bash
# 1. Clone
git clone https://github.com/Quamca/gralfabet-code.git
cd gralfabet-code

# 2. Install dependencies
npm install

# 3. Start dev server (scan QR in Expo Go on Android)
npx expo start

# 4. Type-check
npx tsc --noEmit

# 5. Run tests
npx jest --passWithNoTests
```

To build a local APK for device testing:

```bash
eas build --profile development --platform android
```

## Adding a new exercise module

Each exercise type lives under `/exercises/<module-name>/`. See
`/exercises/README.md` for the module plugin interface contract.

## Documentation

Canonical source of truth is the vault at `../gralfabet-vault/`.
See `00_START_HERE/project-kickoff/PROJECT_BRIEF.md` for product overview.