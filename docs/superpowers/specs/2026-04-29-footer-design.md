# Footer Component Design

**Date:** 2026-04-29  
**Status:** Approved

## Overview

A site footer for the AuctionHouse bidding platform. Rendered on all public-facing pages (browse, auction listings, home). A slim variant renders on auth pages (sign-in, sign-up) to give users navigation escape routes. The dashboard omits the footer entirely — it is an app-style experience.

## Visual Style

- Background: `bg-muted` with `border-t border-border` — a muted panel that visually anchors the bottom of the page without being heavy
- Container: `max-w-4/5 mx-auto px-4 sm:px-6` — matches the Navbar container exactly
- Fully responsive: stacks to single column on mobile, 3-column grid on `md+`

## Layout — Full Footer

### Top Zone (`py-10`)

Three-column grid (`grid-cols-1 md:grid-cols-3 gap-8`):

| Column | Content |
|---|---|
| Brand (col 1) | "AuctionHouse" in `font-heading` (Playfair Display), `text-xl font-bold text-primary` — same style as Navbar logo. Below it: tagline `"Where great things find their value."` in `text-sm text-muted-foreground` |
| Explore (col 2) | Heading: `"Explore"` (`text-sm font-semibold text-foreground`). Links: Browse (`/auctions`), Live Now (`/auctions?filter=live`), Ending Soon (`/auctions?filter=ending`) |
| Company (col 3) | Heading: `"Company"` (`text-sm font-semibold text-foreground`). Links: About (`/about`), FAQ (`/faq`), Contact (`/contact`) |

Link style: `text-sm text-muted-foreground hover:text-foreground transition-colors` — mirrors Navbar nav links.

### Bottom Zone

A `border-t border-border pt-6 pb-8` row containing:
- Left: `© 2026 AuctionHouse. All rights reserved.` in `text-xs text-muted-foreground`
- Right: empty (kept uncluttered)

## Layout — Slim Footer (Auth Pages)

Used on `/sign-in` and `/sign-up` where no Navbar is present. A single-row `py-6` bar:
- Left: "AuctionHouse" brand link (same style as full footer)
- Right: inline links — Browse, Home — so users can exit the auth flow

Same `bg-muted border-t` treatment as the full footer.

## Component Structure

```
components/layout/footer/
  Footer.tsx       — full footer (Server Component, no interactivity needed)
  FooterSlim.tsx   — slim variant for auth pages
```

Both are Server Components — no `'use client'` needed since there's no interactivity.

## Integration

- `app/layout.tsx`: Add `<Footer />` inside `<body>` after `{children}`. The body is already `min-h-full flex flex-col`; the footer sits at the bottom naturally because `{children}` (the main content wrapper) should have `flex-1` applied so it grows to fill available space, pushing the footer down.
- `app/sign-in/layout.tsx` and `app/sign-up/layout.tsx` (create if not present): Wrap with `<FooterSlim />`.
- Dashboard layout: No footer added.

## Placeholders / Future

- `/about`, `/faq`, `/contact` routes do not yet exist — links render as standard anchors and will 404 until those pages are built. This is acceptable for now.
