# Bidding Platform

A full-stack real-time auction platform where users create timed listings, place competing bids, and the highest bidder at the deadline wins.

## Features

- **Browse auctions** — filterable, sortable listing grid with category and status filters
- **Auction detail page** — live countdown timer, real-time current price and bid history via Supabase Realtime
- **Bid placement** — concurrent bids handled safely with a Postgres `SELECT ... FOR UPDATE` lock via the `place_bid` RPC
- **Create listings** — image upload, description, starting price, and deadline
- **Watchlist** — save auctions to follow without bidding
- **Dashboard** — personal stats (auctions won, total spent, active bids), watchlist, recent activity, and a collapsible listings summary
- **My Bids page** — active and historical bids with status badges
- **My Listings page** — manage your own auctions with inline editing and status filters
- **Auth** — email/password sign-up and sign-in via Supabase Auth
- **Automatic auction closing** — pg_cron sweeps every minute; browser timer calls a specific-close action on expiry to handle clock skew

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui v4 (`base-nova` style) |
| Icons | Lucide React |
| Backend / DB | Supabase (Postgres + Auth + Realtime + Storage) |
| Language | TypeScript |
| Deployment | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd bidding-platform
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CRON_SECRET=your_secret_for_cron_endpoint
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other Commands

```bash
npm run build      # production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check without building
```

## Project Structure

```
app/
  (public)/          # Landing page, auction browse, auction detail, new listing
  (auth)/            # Sign-in and sign-up pages
  dashboard/         # Protected dashboard, bids, and listings management
  api/               # Route handlers (e.g. /api/auctions/close-expired)
lib/
  actions/           # Server Functions (mutations)
  queries/           # Server-only data fetching
  supabase/          # Supabase client instances (browser, server, proxy)
components/
  ui/                # shadcn/ui primitives
  shared/            # Shared app components
```

## Database

Schema is managed via the Supabase dashboard SQL editor. Core tables: `profiles`, `auctions`, `bids`, `watchlist`, `notifications`. RLS is enabled on all tables.
