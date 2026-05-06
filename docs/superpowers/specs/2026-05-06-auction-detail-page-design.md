# Auction Detail Page — Design Spec
**Date:** 2026-05-06
**Route:** `/auctions/[id]`

---

## Overview

The auction detail page is the core bidding experience. It shows a single auction's image, metadata, live price, countdown timer, and bid form — with realtime updates via Supabase. Bid history renders in a full-width section below the main two-column area.

---

## Page Architecture & Data Flow

```
app/auctions/[id]/page.tsx          ← Server Component
  │  awaits params, fetches auction + initial bids + seller profile
  │  notFound() if auction ID doesn't exist
  │
  ├── <AuctionImage />               ← Server Component
  ├── <AuctionMeta />                ← Server Component (title, description, seller)
  ├── <BidPanel />                   ← Client Component ('use client')
  │     ├── <CurrentPrice />         ← fed by useRealtimeAuction()
  │     ├── <CountdownTimer />       ← local interval, calls router.refresh() on expiry
  │     └── <BidForm /> | <EndedBanner /> | <SellerPanel /> | <SignInPrompt />
  │
  └── <BidHistory />                 ← Client Component, fed by useRealtimeBids()
```

### Data fetched server-side (no caching)

| Query | File | Returns |
|---|---|---|
| Single auction + seller profile | `lib/queries/auctions.ts` → `getAuction(id)` | `Auction & { seller: Profile }` |
| Initial bids + bidder usernames | `lib/queries/bids.ts` → `getBids(auctionId)` | `(Bid & { bidder: Profile })[]`, last 50, desc |

### Mutations

`lib/actions/bids.ts` → `placeBid(auctionId, amount)` — calls `place_bid` RPC, returns `PlaceBidResult`.

---

## Visual Layout

### Desktop (`lg:grid-cols-[1fr_380px]`)

```
┌─────────────────────────────────────────────────────┐
│  ← Back to auctions                                  │
├───────────────────────────────┬─────────────────────┤
│                               │  ┌ BidPanel ───────┐ │
│  AuctionImage                 │  │ Current Price   │ │
│  aspect-video, rounded-xl     │  │ $4,200          │ │
│  fallback: ImageIcon          │  │                 │ │
│                               │  │ CountdownTimer  │ │
│  AuctionMeta                  │  │ 2h 14m 33s      │ │
│  ─────────────────────        │  │                 │ │
│  Title (2xl font-semibold)    │  │ [BidForm]       │ │
│  Seller: @username · date     │  │ $ ________      │ │
│                               │  │ [Place Bid]     │ │
│  Description                  │  └─────────────────┘ │
│  prose, text-muted-foreground │   sticky top-6        │
│                               │                       │
├───────────────────────────────┴─────────────────────┤
│  BidHistory  (full-width)                            │
│  Bidder · Amount · Time — most recent first          │
└─────────────────────────────────────────────────────┘
```

### Mobile (single column, stacked top-to-bottom)

Image → Meta (title, seller) → BidPanel (full-width, not sticky) → Description → BidHistory

---

## Component Breakdown

### `<AuctionImage />`
- Renders `<Image />` from auction's `image_url`
- `aspect-video`, `rounded-xl`, `object-cover`
- If `image_url` is null: placeholder div with `ImageIcon` (matches `FeaturedAuctions` pattern)

### `<AuctionMeta />`
- Title: `text-2xl font-semibold font-heading`
- Seller line: "Listed by @username · {relative date}"
- Description: prose paragraph, `text-muted-foreground`

### `<BidPanel />` — `'use client'`
Card with `sticky top-6` on desktop. Receives `initialPrice`, `deadline`, `status`, `auction`, `currentUser`.

Contains `<CurrentPrice />` and `<CountdownTimer />`, then renders exactly one of four sub-states (see below).

### `<CurrentPrice />`
- Receives `initialPrice`; updated by `useRealtimeAuction()`
- Brief amber flash animation (300ms) on each price change
- Label: "Current bid" above, large `font-bold text-primary` number

### `<CountdownTimer />`
- Client-side `setInterval` ticking every second
- Formats as `Xd Xh Xm Xs`, switches to red + pulse when under 1 hour
- On expiry: calls `router.refresh()` to re-fetch server data → transitions to closed state

### `<BidForm />`
- Single numeric input: "Your bid", `type="number"`, `min={currentPrice + 1}`
- Hint below input: *Minimum: ${currentPrice + 1}*
- Validation: `zod` client-side (must be number, must exceed current price)
- On submit: calls `placeBid` via `startTransition`, button shows spinner
- On success: clears input, shows toast "Bid placed!"
- On failure: inline error below input (RPC error message, e.g. "You've been outbid — current price is now $X")

### `<EndedBanner />`
- Replaces bid form when `status === 'closed'`
- Shows: "This auction has ended", final price, "Won by @username"
- If `winner_id` is null: "No bids were placed"

### `<SellerPanel />`
- Renders when `currentUser.id === auction.seller_id`
- Displays: total bid count, current leader's username, current price
- "Manage in Dashboard →" button: links to `/dashboard?highlight={auctionId}`
- **Dependency:** `app/dashboard/page.tsx` must read the `highlight` search param and pass it to `<MyListingsCollapsible />`, which scrolls to and applies a highlight ring to the matching row. This is a small addition scoped to the dashboard, included in the implementation plan.

### `<SignInPrompt />`
- Renders when user is not authenticated
- "Sign in to place a bid" label + Sign In button linking to `/sign-in?redirect=/auctions/{id}`

### `<BidHistory />` — `'use client'`
- Full-width section below the two-column area
- Heading: "Bid History" + live bid count badge
- Table/list: bidder username, amount (amber, bold), relative timestamp — most recent first
- Empty state: Gavel icon + "No bids yet — be the first!"
- Fed by `useRealtimeBids(auctionId, initialBids)`

---

## Realtime Hooks

Both hooks live in `lib/hooks/` and are used only on this page.

### `useRealtimeAuction(auctionId, initialPrice)`
- Subscribes to `UPDATE` on `auctions` where `id = auctionId`
- On event: updates `currentPrice` state
- Unsubscribes on unmount

### `useRealtimeBids(auctionId, initialBids)`
- Subscribes to `INSERT` on `bids` where `auction_id = auctionId`
- On each insert: does a follow-up `select` joined with `profiles` to get bidder username (raw payload won't include joined columns)
- Prepends the new bid to the local list
- Unsubscribes on unmount

---

## BidPanel State Matrix

| Condition | Renders |
|---|---|
| `status === 'active'` + logged in + not seller | `<BidForm />` |
| `status === 'active'` + not logged in | `<SignInPrompt />` |
| `status === 'active'` + user is seller | `<SellerPanel />` |
| `status === 'closed'` (any user) | `<EndedBanner />` |

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Auction ID not found | `notFound()` → Next.js 404 |
| Image missing | Placeholder div with `ImageIcon` |
| No bids yet | BidHistory empty state: Gavel + "No bids yet — be the first!" |
| Winner null on closed auction | EndedBanner: "No bids were placed" |
| Bid submitted while being outbid | RPC returns error, shown inline below input |
| Auction closes while user is on page | `CountdownTimer` hits zero → `router.refresh()` → server re-fetches closed state |

---

## New Files

```
app/auctions/[id]/page.tsx
app/auctions/[id]/_components/AuctionImage.tsx
app/auctions/[id]/_components/AuctionMeta.tsx
app/auctions/[id]/_components/BidPanel.tsx
app/auctions/[id]/_components/CurrentPrice.tsx
app/auctions/[id]/_components/CountdownTimer.tsx
app/auctions/[id]/_components/BidForm.tsx
app/auctions/[id]/_components/EndedBanner.tsx
app/auctions/[id]/_components/SellerPanel.tsx
app/auctions/[id]/_components/SignInPrompt.tsx
app/auctions/[id]/_components/BidHistory.tsx
lib/queries/auctions.ts
lib/queries/bids.ts
lib/actions/bids.ts
lib/hooks/useRealtimeAuction.ts
lib/hooks/useRealtimeBids.ts
```
