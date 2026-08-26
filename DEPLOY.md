# Deploying Arcane Ledger to Vercel

Multi-user character sheet on Vercel with Neon Postgres + Auth.js.

## One-time setup

### 1. Install deps locally

```powershell
npm install
```

If `postinstall` errors because Prisma can't find `DATABASE_URL`, that's fine — the schema will generate later.

### 2. Push the repo to GitHub

Repo lives at `https://github.com/PlntGoblin/ARCANE-LEDGER`.

```powershell
git add .
git commit -m "Add multi-user backend (auth, Prisma, syncedStorage)"
git push
```

### 3. Import to Vercel

- Go to https://vercel.com/new and import the GitHub repo.
- Framework preset: **Next.js** (auto-detected).
- Don't deploy yet — click through to project settings.

### 4. Attach a Neon database

- Project → **Storage** → **Create Database** → **Neon** → attach.
- Vercel auto-injects `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (plus a few `POSTGRES_*` aliases you can ignore).

### 5. Add the Auth env vars

Project → **Settings** → **Environment Variables**:

- `AUTH_SECRET` — generate one with `openssl rand -base64 32` (or any long random string). Set for **Production, Preview, Development**.
- `AUTH_URL` — your production URL, e.g. `https://arcane-ledger.vercel.app`. Set for **Production**. Leave unset for Preview/Development so Auth.js picks up Vercel's automatic values.

### 6. Deploy

- Vercel → **Deployments** → **Redeploy**.
- The build command (`prisma generate && prisma migrate deploy && next build --turbopack`) runs the initial migration against the Neon prod branch.
- First load will redirect you to `/login`; click **Sign up** to create your first account.

## Local development

1. Pull the env vars from Vercel:

   ```powershell
   npx vercel link
   npx vercel env pull .env.local
   ```

2. Run the initial migration (safe to re-run):

   ```powershell
   npx prisma migrate dev --name init
   ```

3. Start the dev server:

   ```powershell
   npm run dev
   ```

4. Visit http://localhost:3000 — you'll be redirected to `/login`. Sign up to create the first account.

## What lives where

| Concern | File |
| --- | --- |
| Prisma schema (User + Character) | `prisma/schema.prisma` |
| Prisma client (Neon serverless adapter) | `app/lib/prisma.ts` |
| Auth.js v5 config (Credentials provider) | `auth.ts` |
| NextAuth route | `app/api/auth/[...nextauth]/route.ts` |
| Signup route | `app/api/auth/signup/route.ts` |
| Character load/save API | `app/api/character/route.ts` |
| Route protection | `middleware.ts` |
| Login / signup pages | `app/login/page.tsx`, `app/signup/page.tsx` |
| Session provider | `app/components/SessionProviderWrapper.tsx` |
| Top nav with logout | `app/components/TopNav.tsx` |
| Storage shim (server-backed localStorage) | `app/lib/syncedStorage.ts` |
| Startup gate (waits for character load) | `app/components/AppStateGate.tsx` |

## How the syncing works

The existing `CharacterSheet.tsx` uses `localStorage.getItem/setItem` in ~66 places to persist character state. Rewriting each call site is risky, so instead:

1. `syncedStorage.ts` exposes the same synchronous `getItem/setItem/removeItem` contract as `window.localStorage`, but backed by an in-memory `Map`.
2. `CharacterSheet.tsx` (and `DataTab.tsx`, which also touches localStorage) import it as `import { syncedStorage as localStorage } from '../lib/syncedStorage'`. Every existing `localStorage.*` call now resolves to the shim automatically.
3. `AppStateGate.tsx` calls `loadFromServer()` on mount and holds back rendering `CharacterSheet` until the shim's cache is populated from `GET /api/character`.
4. Every `setItem` triggers a debounced (800ms) `PUT /api/character` that ships the whole cache as a JSON blob. Writes are serialized (in-flight/pending guard) so they can't arrive out of order.
5. `beforeunload` fires a `sendBeacon` best-effort last save so navigating away doesn't lose the final change.

## Migration story for existing localStorage data

If a user (like you) had a character saved in `localStorage` from before this change, `loadFromServer()` detects an empty server row on first load and copies every `dnd-*` key from `window.localStorage` into the shim, then triggers a save. The existing sheet appears in the new account with zero manual work.

## Verification checklist

Local:

1. `npm run dev` → visiting `/` redirects to `/login`.
2. Sign up `alice` / `pw1` → auto-logged-in → blank character sheet loads.
3. Fill in a name / stats. Network tab: `PUT /api/character` fires ~800 ms after last keystroke.
4. Refresh → data persists.
5. Incognito window: sign up `bob` / `pw2`, fill different data. Refresh — bob sees bob's data only.
6. Sign out alice, sign back in — alice's data returns.
7. localStorage migration: fresh incognito profile, seed `dnd-character-data` in DevTools before signup — character is uploaded after login.

Deployed (Vercel URL): repeat all 7 steps. Then confirm in Neon console: 2 `User` rows, 2 `Character` rows.

## Risks / notes

- **Next.js 16 + Auth.js v5 (beta):** both are very new. If Auth.js misbehaves, pin `next` to `15.5.x` in `package.json` and redeploy — all App Router APIs used here are identical in 15.5. Upgrade Next after Auth.js publishes a Next-16-compatible release.
- **Save races:** the in-flight/pending guard in `syncedStorage.ts` is load-bearing; don't remove it.
- **JSON blob size:** with images stored as URL strings (Pinterest links, etc.), rows are ~5–50 KB. Well within Neon's limits. If someone pastes a base64 data URL, the blob will grow, but performance is still fine at a few MB.
- **Schema drift:** if you later add fields to `Character` in `app/types/character.ts`, existing sessions still work — old blob just lacks the key and the code paths that read it get `null`, which the existing defaults handle.
