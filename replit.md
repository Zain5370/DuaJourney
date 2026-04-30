# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Dua Learning App (`artifacts/dua-app`)

Expo (React Native + web) Islamic Dua memorization app.

### Features
- **Home (Today)**: greeting, search, daily goal ring, stats row, Dua of the Day, today's two Duas (sequential unlock), browse by length, favorites preview.
- **Library**: full Dua list with category + length filters, search.
- **Favorites**: list of hearted Duas.
- **Progress**: streak (current/best), overall ring, by-category bars, memorized list, reset.
- **Sidebar drawer** (slide-in): Light Mode / Dark Mode toggle, nav links to 99 Names of Allah, Settings.
- **99 Names of Allah** screen: hero verse + grid of 99 names (Arabic / transliteration / meaning).
- **Settings**: theme (light / dark / system), accent color (5 options), language (English / Arabic / Urdu / Hindi / Bangla / French), font size (S/M/L/XL), font style (Naskh / Kufi / Nastaliq — Arabic script names).
- **Loading screen**: animated app icon with pulse animation while Duas are fetched, with retry on error.

### Data source
- **Offline first**: 74 Duas are bundled at build time in `constants/bundledDuas.ts` (auto-generated). The app shows them instantly with no network or spinner.
- On launch, the cached payload (if newer than the bundle) is loaded from AsyncStorage, and a background refresh from `hadithapi.com` (Sahih Bukhari, chapters 80 & 81 — Invocations) is attempted. Network failures are silently ignored — bundled / cached duas remain in place.
- Regenerate the bundle with `node scripts/generate-duas.mjs` (re-runs the same fetch + transform pipeline against the API).
- API key is embedded in `services/hadithApi.ts` and `scripts/generate-duas.mjs` (user-supplied; client bundle).
- Each Dua exposes `bookReference` (e.g. "Sahih Bukhari") and `hadithNumber` (e.g. "6305") in addition to title, Arabic, English, Urdu, category, and length.
- `length` is `Short | Medium | Long`, derived from Arabic character count (replaces the old `difficulty` field).
- Category is keyword-derived from the heading + English text.
- Results are cached in AsyncStorage (`@dua_app/duas_cache_v1`, 7-day TTL) and refreshed in the background on launch.

### State (AsyncStorage)
- `@dua_app/settings_v1` — SettingsContext
- `@dua_app/favorites_v1` — FavoritesContext
- `@dua_app/progress_v1` — completed today / learned set
- `@dua_app/streak_v1` — daily streak
- `@dua_app/duas_cache_v1` — fetched duas + timestamp

### Key files
- `services/hadithApi.ts` — hadithapi.com client + transformer
- `contexts/DuasContext.tsx` — provider that loads/caches duas, exposes `useDuas()`
- `components/LoadingScreen.tsx` — full-screen icon + spinner with retry
- `contexts/SettingsContext.tsx`, `contexts/FavoritesContext.tsx`, `contexts/ProgressContext.tsx`
- `constants/duas.ts` (types + categories + lengths only — no static data)
- `constants/translations.ts` (6-language dict), `constants/names99.ts`, `constants/colors.ts`
- `components/Sidebar.tsx`, `components/DuaCard.tsx` (shows `bookRef · #hadithNumber`)
- `app/(tabs)/index.tsx`, `library.tsx`, `favorites.tsx`, `progress.tsx`
- `app/settings.tsx`, `app/names99.tsx`, `app/dua/[id].tsx`, `app/_layout.tsx` (provider tree)
