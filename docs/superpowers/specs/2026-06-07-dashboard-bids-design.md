# Dashboard Bids Page — Design Spec
_Date: 2026-06-07_

## Overview

Add a dedicated `/dashboard/bids` page for full bid management (active + history). Replace the existing `ActiveBids` carousel on the main dashboard with a compact mini-grid summary widget that links to the new page.

---

## 1. Route & Structure

- **New route**: `app/dashboard/bids/page.tsx` — Server Component, protected by existing middleware.
- **Main dashboard** (`app/dashboard/page.tsx`): Remove `<ActiveBids>` and its carousel. Replace with `<BidsSummary>` fed `activeBids.slice(0, 5)` — no new query needed.
- **Bids page**: Full-width layout with shadcn `<Tabs>` (Active | History). Each tab owns its own filter/search state.

---

## 2. Main Dashboard Widget — `BidsSummary`

**Files:**
- `app/dashboard/_components/BidsSummary/BidsSummary.tsx` — Server shell (Card wrapper, passes props)
- `app/dashboard/_components/BidsSummary/BidsSummaryContent.tsx` — `'use client'`, handles chip state

**Behaviour:**
- Shows the 5 most recent active bids (first 5 from `getActiveBids`, already ordered by `created_at DESC`)
- Filter chips: `Winning` / `Losing` — toggle between the two (no "All"; the full list is one click away)
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`
- Uses existing `BidCard` with `variant="grid"` (renders `w-full` instead of `w-52 shrink-0`)
- Header includes `<Link href="/dashboard/bids">View all bids →</Link>`
- Empty state (zero active bids): small prompt with link to `/auctions`

---

## 3. `/dashboard/bids` Page

**Files:**
- `app/dashboard/bids/page.tsx` — Server Component; fetches `getActiveBids` + `getHistoryBids` in parallel; renders `<BidsPageContent>`
- `app/dashboard/bids/_components/BidsPageContent.tsx` — `'use client'`; owns tab state via shadcn `<Tabs>`
- `app/dashboard/bids/_components/ActiveBidsTab.tsx` — `'use client'`; filter + search + grid
- `app/dashboard/bids/_components/HistoryBidsTab.tsx` — `'use client'`; filter + time select + search + grid

### Active tab (`ActiveBidsTab`)

Header row:
- Filter chips: `All` / `Outbid` / `Ending soon` (same logic as existing `ActiveBidsContent`)
- Search input: right side of header, filters displayed bids by title (client-side, case-insensitive)

Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, `BidCard variant="grid"`

Empty state: per filter + search combination.

### History tab (`HistoryBidsTab`)

Header row:
- Filter chips: `All` / `Won` / `Lost`
- Time select (shadcn `<Select>`): `All time` / `This month` / `This year` — right-aligned next to chips
- Search input: filters displayed history bids by title (client-side)

Grid: same as Active tab.

`BidCard` in closed state:
- Badge shows `Won` (green) or `Lost` (red) instead of `Winning` / `Outbid`
- CTA is always a plain "View" `<Link>` (no "Raise Bid" on ended auctions)
- Countdown timer shows ended state (existing `useCountdown` behaviour for past deadlines)

Empty state: per filter + time + search combination.

---

## 4. Data Layer

### Existing — no changes
- `getActiveBids(userId)` — unchanged; returns active bids ordered by `created_at DESC`, deduplicated by `auction_id`

### New — `getHistoryBids(userId)`

Location: `lib/queries/auctions.ts`

```ts
supabase
  .from('bids')
  .select('amount, auction_id, auctions!inner (title, image_url, current_price, deadline, status, winner_id)')
  .eq('bidder_id', userId)
  .eq('auctions.status', 'closed')
  .order('created_at', { ascending: false })
```

- Deduplicated by `auction_id` (same pattern as `getActiveBids`)
- During deduplication, computes `won: boolean` (`auction.winner_id === userId`) and includes it in the returned object
- Returns a new type `historyBidsType` — extends `dashboardBids` with `amount: number` and `won: boolean`
- `winner_id` is not exposed to the client; `won` is a derived boolean computed server-side

### `BidCard` changes

Add `variant?: 'carousel' | 'grid'` prop:
- `'carousel'` (default): existing `w-52 shrink-0` behaviour
- `'grid'`: `w-full` — fills grid cell

Add closed-auction display logic:
- When `auctions.status === 'closed'`: badge renders `Won` / `Lost`, CTA is always `<Link>View</Link>`
- `won` prop passed in (boolean, computed server-side in `getHistoryBids`)

---

## 5. What Does NOT Change

- `BidsCarousel` component — kept but no longer used on the dashboard (can be used elsewhere or left in place)
- `ActiveBidsContent` — logic duplicated into `ActiveBidsTab` (same filter logic, different layout). Do not refactor `ActiveBidsContent` — leave it to avoid breaking anything.
- `getActiveBids` return type — unchanged
- All existing dashboard sections (StatsStrip, Watching, RecentActivity, MyListings) — untouched

---

## 6. Filtering Logic (client-side)

**Active tab** — applied in order:
1. Status chip: `outbid` → `amount !== current_price`; `ending-soon` → deadline within 1 hour
2. Search: `title.toLowerCase().includes(query.toLowerCase())`

**History tab** — applied in order:
1. Status chip: `won` → `winner_id === userId`; `lost` → `winner_id !== userId`
2. Time: `this-month` → same month+year; `this-year` → same year
3. Search: `title.toLowerCase().includes(query.toLowerCase())`
