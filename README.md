# Bidding Platform

A full-stack real-time auction platform where users create timed listings, place competing bids, and the highest bidder at the deadline wins.

<img width="1896" height="910" alt="Bidding Platform" src="https://github.com/user-attachments/assets/cfb9cba3-f357-4d48-8cf9-3d2da032b418" />

<img width="1895" height="898" alt="image" src="https://github.com/user-attachments/assets/faad91b1-dc14-4365-bcdb-1d06e680ee86" />

<img width="1900" height="910" alt="image" src="https://github.com/user-attachments/assets/76ac144f-08f4-4615-989d-da20f1482c96" />

<img width="1895" height="902" alt="image" src="https://github.com/user-attachments/assets/4179fcb3-0f27-43b5-b6f5-4c43e2230b40" />

<img width="1895" height="901" alt="image" src="https://github.com/user-attachments/assets/f4670bad-8b7b-4227-aa0e-a4f1fe7b470f" />


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
