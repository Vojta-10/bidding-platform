# Landing Page Design Spec

**Date:** 2026-05-04
**Route:** `/` (`app/(public)/page.tsx`)
**Status:** Approved

---

## Overview

A minimal, buyer-focused landing page that replaces the current Next.js placeholder. Establishes the platform identity and funnels visitors toward browsing live auctions. Four sections in a fixed narrative order: Hero → Stats → Featured Auctions → How It Works.

---

## Architecture

- Server Component — no `'use client'` needed; no interactivity on the page
- Lives entirely in `app/(public)/page.tsx`
- Sections are small inline components or plain JSX within the page file — no separate files needed at this scale
- Featured auction cards use static placeholder data; no Supabase queries yet

---

## Section 1: Hero

**Layout:** Full-viewport height (`min-h-[calc(100vh-4rem)]`), content center-aligned both axes.

**Content:**
- Headline: `font-heading` (Playfair Display), ~4–5rem, tight tracking, two lines max. Text: *"Where Great Things Find Their Value."*
- Subheadline: `text-muted-foreground`, ~1.125rem, max-width ~42ch. Text: *"Discover rare items, compete in live auctions, and win at the price you set."*
- Primary CTA: amber filled button (size `lg`) — "Browse Live Auctions" → `/auctions`
- Secondary CTA: `text-sm text-muted-foreground hover:text-foreground` plain text link — "Start Selling →" → `/auctions/new`

**Background:** `bg-background`. Subtle warm radial gradient centered behind the headline — amber at ~3% opacity — adds depth without competing with the text.

---

## Section 2: Stats Strip

**Layout:** Full-width horizontal strip, 4-column on desktop, 2×2 grid on mobile. Top border separates from hero. Subtle `bg-muted/30` background.

**Stats (static/hardcoded for now):**

| Value  | Label              |
|--------|--------------------|
| 1,240  | Live Auctions      |
| $2.4M  | Total Value Traded |
| 8,500  | Registered Members |
| 94%    | Satisfaction Rate  |

**Typography:** Number in `font-heading` (~2rem) amber colored; label in `text-sm text-muted-foreground`. Columns separated by `border-r` on all but the last.

---

## Section 3: Featured Auctions

**Layout:** Section heading "Live Right Now" left-aligned; "View All Auctions →" link (`/auctions`) flush right. 3-column card grid below on desktop, single column on mobile. 4 static placeholder cards (4th hidden on desktop via `md:hidden` on the last card, visible on mobile).

**Each card:**
- Image area: `aspect-video`, `bg-muted`, `rounded-t-xl`, centered `ImageIcon` from lucide as placeholder
- Title: `font-medium`, 2 lines max with `line-clamp-2`
- Current bid: muted label + amber-colored price value
- Countdown badge: `⏱ Xh Xm left` — amber at normal time, red + pulse animation when < 1h (static, so just render one variant)
- CTA: "Place Bid" primary button, full width, links to `/auctions`

**Placeholder data (4 items):**

| Title                         | Price   | Time Left |
|-------------------------------|---------|-----------|
| Vintage Rolex Submariner 1968 | $4,200  | 2h 14m    |
| Mid-Century Eames Lounge      | $1,850  | 5h 40m    |
| First Edition Hemingway       | $320    | 23m        |
| Leica M6 35mm Film Camera     | $2,100  | 1d 3h     |

Card visual language matches the dashboard `BidCard`: consistent border, hover shadow lift, `rounded-xl`.

---

## Section 4: How It Works

**Layout:** Centered section heading "How It Works". Three steps in a horizontal row on desktop, stacked on mobile. Subtle `bg-muted/20` background with generous vertical padding frames it as a distinct zone.

**Each step:**
- Step number: small amber circle (`size-8`, `bg-primary`, `rounded-full`, white number)
- Icon: lucide icon below number, `size-6`, `text-muted-foreground`
- Heading: `font-heading`, ~1.125rem
- Body: `text-sm text-muted-foreground`, max ~20ch

**Steps:**

| # | Icon     | Heading | Body |
|---|----------|---------|------|
| 1 | `Search` | Browse  | Browse hundreds of live auctions across all categories. |
| 2 | `Gavel`  | Bid     | Place your bid before the clock runs out — raise anytime you're outbid. |
| 3 | `Trophy` | Win     | Highest bidder at deadline takes it home. |

**Connector:** `border-t border-dashed border-muted-foreground/30` between the step circles on desktop (`hidden` on mobile).

**Footer CTA:** Centered text link below the steps — "Ready to start? Create your first listing →" → `/auctions/new`.

---

## Mobile Behavior

- Hero: text scales down, CTAs stack vertically
- Stats: 2×2 grid
- Featured Auctions: single column, all 4 cards visible
- How It Works: steps stack vertically, connector line hidden

---

## Out of Scope

- Real auction data (Supabase queries) — placeholder only for now
- Category browsing section
- Seller-focused CTA section
- Animations beyond the countdown pulse badge
