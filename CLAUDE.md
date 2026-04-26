# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack auction/bidding platform: users create timed auction listings, others place bids, and the highest bidder at deadline wins. Built with Next.js 16 App Router, Tailwind CSS v4, shadcn/ui v4, and Supabase (Auth, Postgres, Realtime, Storage).

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check without building
```

Adding shadcn/ui components: `npx shadcn@latest add <component-name>`

## ⚠️ Next.js 16 — breaking changes from training data

**Read `node_modules/next/dist/docs/` before writing any Next.js code.** This version has breaking changes:

- **`params` and `searchParams` are Promises** — always `await` them in pages/layouts:
  ```ts
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  }
  ```
- **`cookies()` is async** — `const cookieStore = await cookies()`
- **Server Functions** (formerly Server Actions) use `'use server'` and are called via `startTransition` on the client or directly from forms
- **No `fetch` caching by default** — add `'use cache'` directive or wrap in `<Suspense>` for streaming

## Architecture

### Data flow

```
Supabase Postgres ──► lib/queries/*.ts (server-only)
                            │
                     app/**/page.tsx (Server Components, fetch at request time)
                            │
                     components/**/*.tsx (Client Components for interactivity)
                            │
                     lib/actions/*.ts ('use server' — mutations via RPC/insert)
```

### Supabase client instances

Three distinct clients — using the wrong one will silently break auth:

| File | Use in | Notes |
|---|---|---|
| `lib/supabase/client.ts` | Client Components, hooks | `createBrowserClient` — singleton, safe to call repeatedly |
| `lib/supabase/server.ts` | Server Components, Server Functions, Route Handlers | `createServerClient` with async cookies — must be called per-request, not cached |
| `lib/supabase/middleware.ts` | `middleware.ts` only | Refreshes the session cookie on every request — critical for auth |

### Bid placement — always use the `place_bid` RPC

Never insert into the `bids` table directly from application code. The `place_bid` Postgres function uses `SELECT ... FOR UPDATE` to serialize concurrent bids and atomically update `auctions.current_price`. Call it via:
```ts
const { data } = await supabase.rpc('place_bid', { p_auction_id, p_bidder_id, p_amount })
```

### Realtime

Subscriptions live only on the auction detail page (`/auctions/[id]`), never on the browse grid:
- `useRealtimeAuction(auctionId)` — watches `UPDATE` on `auctions` → feeds `<CurrentPrice />`
- `useRealtimeBids(auctionId, initialBids)` — watches `INSERT` on `bids` → feeds `<BidHistory />`

Realtime payloads from `postgres_changes` don't include joined columns — do a follow-up `select` with join when a new bid arrives to get the bidder's username.

### Server Components vs Client Components

- Pages and layouts are Server Components by default — fetch data directly, no `useEffect`
- Add `'use client'` only when you need state, event handlers, browser APIs, or hooks
- Pass server-fetched data as props into Client Components for hydration

### Auction expiry

Auctions are closed by the `close_expired_auctions()` Postgres function. It's invoked:
1. By pg_cron every minute (set up in Supabase dashboard)
2. By `POST /api/auctions/close-expired` (requires `CRON_SECRET` header) — for Vercel Cron or manual trigger
3. Defensively inside `place_bid` if the deadline has passed

When `<CountdownTimer />` expires, call `router.refresh()` so the Server Component re-fetches and shows the closed state.

## Tailwind CSS v4

**No `tailwind.config.ts`** — configuration lives entirely in `app/globals.css`:
- Theme tokens are CSS custom properties under `:root` and `.dark`
- `@theme inline { ... }` maps CSS vars to Tailwind utilities
- Dark mode uses `.dark` class (added to `<html>`) — not `prefers-color-scheme`
- The primary/accent color is amber (`oklch(0.79 0.17 62)`)

## shadcn/ui v4

Style is `base-nova` (set in `components.json`). Components are in `components/ui/`. Icons come from `lucide-react`. There is no separate `form.tsx` registry component — build forms with `react-hook-form` + `zod` directly using the `Input`, `Label`, and `Textarea` primitives.

## Key environment variables

| Variable | Used where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Both client and server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both client and server |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — bypasses RLS, never expose to browser |
| `CRON_SECRET` | `POST /api/auctions/close-expired` header validation |

## Database

Schema is managed via the Supabase dashboard SQL editor (no local CLI or migration files). Tables: `profiles`, `auctions`, `bids`. RLS is enabled on all tables. The `profiles` row is auto-created by the `handle_new_user` trigger on `auth.users` insert — never create profiles manually.
