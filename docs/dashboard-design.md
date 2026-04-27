# Dashboard Design

## Navigation

**Top navbar** — not a sidebar. Auction platforms are marketplaces, not analytics tools.

```
[AuctionHouse]  [Browse] [Live Now] [Ending Soon]  [__ Search __]  [🔔] [+ Create Listing] [Avatar ▾]
```

- Logo in Playfair Display, amber colored
- Search is center-dominant — discovery is the primary action
- `+ Create Listing` is a filled amber button, always visible
- Bell opens notification popover (outbid / won / new bid types)
- Avatar opens dropdown: Dashboard, My Bids, My Listings, ── Sign Out

---

## Dashboard Page `/dashboard`

### 1. Stats Strip
Four cards across the top, full width:

| Card | Value |
|---|---|
| Active Bids | number of auctions user is currently bidding on |
| Auctions Won | total wins |
| My Listings | number of user's active listings |
| Total Spent | sum of winning bids |

---

### 2. Active Bids _(priority section, full width)_
Horizontally scrollable row of auction cards — auctions the user has placed a bid on and are still running.

Each card shows:
- Auction image
- Title
- Countdown timer (pulses red when < 1 hour)
- Current price
- Status badge: `Winning` (green) or `Outbid` (red)
- If **Outbid**: inline "Raise Bid" CTA button

---

### 3. Two-column grid

**Left (wider) — Watching**
Auctions the user has saved/watched but not yet bid on. Same card format as Active Bids but no status badge — just a "Place Bid" CTA.

**Right (narrower) — Recent Activity**
Timestamped feed of bid events:
- You placed a bid on X — $200
- You were outbid on X
- You won X
- Someone bid on your listing X

---

### 4. My Listings _(below, collapsible)_
Table view of the user's created auctions:

| Column | Notes |
|---|---|
| Title | links to auction detail |
| Status | `Active` (green) / `Ended` (muted) / `Draft` (amber) |
| Current Price | — |
| Bids | count |
| Time Left | countdown or "Ended" |

---

## Key UX Decisions

- **Urgency states**: Outbid cards and countdowns under 1h use red/amber with a subtle pulse animation
- **No sidebar anywhere** — sub-pages (My Listings, Settings) use a tab strip under the navbar
- **Mobile**: navbar collapses to hamburger, stats stack 2×2, bid cards go full width
- **Empty states**: each section has a meaningful empty state (e.g. "No active bids — Browse auctions →")
