# My Listings Page — Design Spec

**Date:** 2026-06-09  
**Branch:** dashboard-bids  
**Status:** Approved, ready for implementation

---

## Overview

A dedicated `/dashboard/listings/` page giving sellers a full-featured view of their auction listings. Replaces the collapsible widget on the main dashboard with a proper data table: filterable by status and performance, sortable by any column, and with an edit modal for unlocked listings.

---

## 1. Page Structure & Data

### Route
`/dashboard/listings/` — new page, sits alongside `/dashboard/bids/`.

### Files
```
app/dashboard/listings/page.tsx                          # Server Component
app/dashboard/listings/_components/ListingsPageContent.tsx  # Client Component (all state)
app/dashboard/listings/_components/ListingsTable.tsx        # Sortable table shell
app/dashboard/listings/_components/ListingsTableRow.tsx     # Row with Edit/View buttons
app/dashboard/listings/_components/EditListingModal.tsx     # Dialog form
lib/actions/updateListing.ts                                # Server action
```

### Data query changes
`getMyListings` in `lib/queries/auctions.ts` — extend the select to include `description` and `image_url`:
```ts
.select('id, title, description, image_url, current_price, deadline, status, bid_count')
```
`MyListingsType` in the same file gets `description: string` and `image_url: string | null`.

### Dashboard summary update
`MyListingsCollapsible` gets a **"View all listings →"** link to `/dashboard/listings/`, following the same pattern as `BidsSummary` → `/dashboard/bids`.

### Server action — `updateListing`
`lib/actions/updateListing.ts`:
- Auth check — reject if not signed in
- Ownership check — verify `seller_id = user.id` for the given listing id
- Lock check — reject with `{ error: 'Listing is locked once bids are placed' }` if `bid_count > 0`
- Update `title` and `description` on `auctions`
- If a new image file provided: upload to Storage at `userId/timestamp-sanitized-title`, update `image_url`
- Returns `{ success: true }` or `{ error: string }`

---

## 2. Filters & Sorting

### Filter bar layout
```
[All] [Active] [Closed]   [All] [Has bids] [No bids]        [🔍 Search by title…]
```
Left side: status chips. Middle: performance chips. Right: search input (same `sm:w-64` pattern).

All three filters compose — a listing passes only if it satisfies every active condition simultaneously.

### Filter logic (client-side, in `ListingsPageContent`)
```ts
type StatusFilter = 'all' | 'active' | 'closed'
type PerformanceFilter = 'all' | 'has-bids' | 'no-bids'
```
- Status: match `listing.status`
- Performance: `listing.bid_count > 0` vs `=== 0`
- Search: `listing.title.toLowerCase().includes(query.toLowerCase())`

Any filter change resets pagination to page 1.

### Sortable columns
Columns: **Title**, **Status**, **Current Price**, **Bids**, **Deadline**

Sort state: `{ column: SortColumn | null, direction: 'asc' | 'desc' }` where `SortColumn = 'title' | 'status' | 'current_price' | 'bid_count' | 'deadline'`.  
- First click on a column → sort ascending  
- Second click → flip to descending  
- Active column shows a `↑` or `↓` icon; inactive columns show a neutral `↕` icon on hover  

Default sort (column = null): status ascending then deadline ascending — matches current DB order so the table looks consistent on first load.

### Pagination
Reuse `usePagination` hook, default page size **10** (full page, not dashboard widget).

---

## 3. Edit Modal

### Trigger
Each row's Action cell contains:
- **View** link → `/auctions/[id]` (always present)
- **Edit** button → opens modal (only when `bid_count === 0`); replaced with a **lock icon** when `bid_count > 0`

### Modal contents
shadcn `<Dialog>` with a react-hook-form + zod form:

| Field | Pre-filled | Validation |
|---|---|---|
| Title | `listing.title` | required, max 90 chars |
| Description | `listing.description` | required, min 10, max 200 chars |
| Image | thumbnail preview of `listing.image_url` if set | optional; jpeg/png only |

Image behavior: file input to replace the current image. Removing without replacing is not supported. If no new file is selected, `image_url` is unchanged.

### Submit flow
1. `handleSubmit` via `useTransition` (button shows loading state)  
2. If new image file: call `uploadFile` (same module-level function pattern from `NewAuctionForm`) → get new URL. On upload failure: show warning toast, proceed without updating `image_url`  
3. Call `updateListing(id, { title, description, image_url? })` server action  
4. On success: `router.refresh()`, close modal, success toast  
5. On error: error toast, modal stays open  

### Zod schema
Extract shared title/description rules from `newAuctionSchema` in `lib/validations/auction.ts` into a `listingEditSchema` (title + description only). Image validated client-side before upload.

---

## 4. Key Constraints & Invariants

- `bid_count > 0` means the listing is fully locked — no edits to any field
- Image upload follows the same `auction-images` Storage bucket path: `userId/timestamp-sanitized-title`
- `params` in Next.js 16 is a Promise — await it if needed in the page
- No tabs needed — unlike Bids, all listings live in a single table (filters handle segmentation)
- Do not use `close_expired_auctions` or `place_bid` RPC in this feature
- Existing `MyListingsCollapsible` on the dashboard stays as-is; only add the "View all" link
