# Bidding Platform (AuctionHouse)

## Project Overview
AuctionHouse is a modern, marketplace-style auction platform built with **Next.js 16 (React 19)** and **Supabase**. It focuses on a clean, center-dominant search experience for discovery and a robust dashboard for managing active bids and listings.

### Core Tech Stack
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Backend:** [Supabase](https://supabase.com/) (Auth, Database, Realtime, Storage)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Config in `app/globals.css`)
- **Components:** [shadcn/ui v4](https://ui.shadcn.com/) (Style: `base-nova`)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)

## ⚠️ Next.js 16 Breaking Changes
- **Async APIs:** `params`, `searchParams`, and `cookies()` are now **Promises**. Always `await` them.
- **Caching:** No `fetch` caching by default. Use `'use cache'` or `<Suspense>` for streaming.
- **Server Functions:** Use `'use server'` for mutations.

## Architecture & Data Flow
```
Supabase Postgres ──► lib/queries/*.ts (Server-only)
                            │
                     app/**/page.tsx (Server Components)
                            │
                     components/**/*.tsx (Client Components)
                            │
                     lib/actions/*.ts ('use server' mutations)
```

### Supabase Client Usage
| Client File | Usage |
|---|---|
| `lib/supabase/client.ts` | Client Components and hooks (`createBrowserClient`) |
| `lib/supabase/server.ts` | Server Components, Actions, and Route Handlers (`createServerClient`) |
| `lib/supabase/middleware.ts` | `middleware.ts` only (Session refreshing) |

## Development Conventions
- **Bid Placement:** **NEVER** insert into `bids` directly. Use the `place_bid` RPC:
  ```ts
  const { data } = await supabase.rpc('place_bid', { p_auction_id, p_bidder_id, p_amount })
  ```
- **Realtime:** Subscriptions belong on auction detail pages (`/auctions/[id]`). Use `useRealtimeAuction` and `useRealtimeBids` hooks.
- **Styling:** Tailwind CSS 4 configuration is in `app/globals.css`. The primary color is Amber (`oklch(0.79 0.17 62)`).
- **Forms:** Build forms using `react-hook-form` + `zod` directly with `Input`, `Label`, and `Textarea` primitives (no separate `Form` registry component).
- **Database:** Managed via Supabase dashboard. `profiles` are auto-created via Postgres triggers on user signup.

## Building and Running
- `npm run dev`: Start development server.
- `npm run build`: Production build.
- `npm run lint`: ESLint check.
- `npx tsc --noEmit`: Type-check.
- `npx shadcn@latest add <component>`: Add UI components.
