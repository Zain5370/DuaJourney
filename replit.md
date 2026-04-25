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
- **Home (Today)**: greeting, search, daily goal ring, stats row, Dua of the Day, today's two Duas (sequential unlock), browse by difficulty, favorites preview.
- **Library**: full Dua list with category + difficulty filters, search.
- **Favorites**: list of hearted Duas.
- **Progress**: streak (current/best), overall ring, by-category bars, memorized list, reset.
- **Sidebar drawer** (slide-in): Light Mode (big) / Dark Mode (small) toggle buttons, nav links to 99 Names of Allah, Settings.
- **99 Names of Allah** screen: hero verse + grid of 99 names (Arabic / transliteration / meaning).
- **Settings**: theme (light / dark / system), accent color (5 options), language (English / Arabic / Urdu / Hindi / Bangla / French), font size (S/M/L/XL), font style (Poppins / System / Serif).

### State (AsyncStorage)
- `@dua_app/settings_v1` — SettingsContext
- `@dua_app/favorites_v1` — FavoritesContext
- `@dua_app/progress_v1` — completed today / learned set
- `@dua_app/streak_v1` — daily streak

### Key files
- `contexts/SettingsContext.tsx`, `contexts/FavoritesContext.tsx`, `contexts/ProgressContext.tsx`
- `constants/translations.ts` (6-language dict), `constants/names99.ts`, `constants/colors.ts` (light/dark + 5 accents)
- `components/Sidebar.tsx` (Sidebar + MenuButton), `components/DuaCard.tsx` (with favorite heart toggle)
- `app/(tabs)/index.tsx`, `library.tsx`, `favorites.tsx`, `progress.tsx`
- `app/settings.tsx`, `app/names99.tsx`, `app/dua/[id].tsx`
