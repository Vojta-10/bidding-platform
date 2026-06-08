# My Listings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/dashboard/listings/` page with a filterable, sortable table of the user's auction listings and an edit modal for unlocked listings.

**Architecture:** Client-side filtering and sorting — all listings loaded server-side on page load, passed to a client component that handles status/performance/search filters, column-header sort, and pagination with `usePagination`. An edit modal (shadcn `<Dialog>`) uses react-hook-form + zod and calls a new `updateListing` server action; locked listings (`bid_count > 0`) show a lock icon instead of an edit button. The existing dashboard `MyListingsCollapsible` gets a "View all" link added.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase (auth + postgres + storage), Tailwind CSS v4, shadcn/ui v4 (base-nova), react-hook-form, zod, lucide-react, sonner

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Install | `components/ui/dialog.tsx` | shadcn Dialog primitives |
| Modify | `lib/validations/auction.ts` | Add `listingEditSchema` + `listingEditValues` type |
| Modify | `lib/queries/auctions.ts` | Widen `MyListingsType` + extend `getMyListings` select |
| Create | `lib/actions/updateListing.ts` | Server action: auth, ownership, lock, update |
| Create | `app/dashboard/listings/_components/EditListingModal.tsx` | Dialog form for editing title/description/image |
| Create | `app/dashboard/listings/_components/ListingsPageTable.tsx` | Sortable table shell + `SortColumn`/`SortState` types |
| Create | `app/dashboard/listings/_components/ListingsPageRow.tsx` | Table row — countdown timer, Edit/View actions |
| Create | `app/dashboard/listings/_components/ListingsPageContent.tsx` | Client component — all filter/sort/pagination/modal state |
| Create | `app/dashboard/listings/page.tsx` | Server Component — fetches listings, renders content |
| Modify | `app/dashboard/_components/MyListings/MyListingsCollapsible.tsx` | Add "View all listings →" link |

---

## Task 1: Install the shadcn Dialog component

**Files:**
- Create: `components/ui/dialog.tsx`

- [ ] **Step 1: Run the shadcn add command**

```bash
npx shadcn@latest add dialog
```

Expected output includes `✔ Created 1 file:` and `components/ui/dialog.tsx`.

- [ ] **Step 2: Verify the file exists**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/dialog.tsx
git commit -m "chore: add shadcn dialog component"
```

---

## Task 2: Extend validation schema and data types

**Files:**
- Modify: `lib/validations/auction.ts`
- Modify: `lib/queries/auctions.ts` (lines 26–33 for type, lines 247–260 for query)

- [ ] **Step 1: Add `listingEditSchema` to `lib/validations/auction.ts`**

Append after the existing `newAuctionValues` export:

```ts
export const listingEditSchema = z.object({
  title: z
    .string()
    .max(90, "Title can't be longer than 90 characters!")
    .nonempty('Title cannot be empty!'),
  description: z
    .string()
    .max(200, 'Description is way too long!')
    .min(10, 'Description must be atleast 10 characters long!'),
});

export type listingEditValues = z.infer<typeof listingEditSchema>;
```

- [ ] **Step 2: Widen `MyListingsType` in `lib/queries/auctions.ts`**

Replace the existing type (lines 26–33):

```ts
export type MyListingsType = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  current_price: number;
  deadline: string;
  status: string;
  bid_count: number;
};
```

- [ ] **Step 3: Extend the select string in `getMyListings` (around line 255)**

Change:
```ts
.select('id, title, current_price, deadline, status, bid_count')
```
To:
```ts
.select('id, title, description, image_url, current_price, deadline, status, bid_count')
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. (`StatsStrip` only reads `deadline` and `status` from `MyListingsType` so it is unaffected.)

- [ ] **Step 5: Commit**

```bash
git add lib/validations/auction.ts lib/queries/auctions.ts
git commit -m "feat: extend MyListingsType with description and image_url for edit modal"
```

---

## Task 3: Create `updateListing` server action

**Files:**
- Create: `lib/actions/updateListing.ts`

- [ ] **Step 1: Create the file**

```ts
'use server';

import { createClient } from '../supabase/server';
import { listingEditSchema } from '../validations/auction';

export async function updateListing(
  listingId: string,
  title: string,
  description: string,
  imageUrl?: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to perform this action!' };

  const result = listingEditSchema.safeParse({ title, description });
  if (!result.success) return { error: result.error.issues[0].message };

  const { data: listing, error: fetchError } = await supabase
    .from('auctions')
    .select('seller_id, bid_count')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) return { error: 'Listing not found.' };
  if (listing.seller_id !== user.id) return { error: 'You do not own this listing.' };
  if (listing.bid_count > 0)
    return { error: 'Listing is locked once bids are placed.' };

  const updates: Record<string, unknown> = { title, description };
  if (imageUrl) updates.image_url = imageUrl;

  const { error: updateError } = await supabase
    .from('auctions')
    .update(updates)
    .eq('id', listingId);

  if (updateError) return { error: updateError.message };
  return { success: true };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/actions/updateListing.ts
git commit -m "feat: add updateListing server action with ownership and lock checks"
```

---

## Task 4: Build `EditListingModal` component

**Files:**
- Create: `app/dashboard/listings/_components/EditListingModal.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p "app/dashboard/listings/_components"
```

Create `app/dashboard/listings/_components/EditListingModal.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateListing } from '@/lib/actions/updateListing';
import { createClient } from '@/lib/supabase/client';
import { listingEditSchema, listingEditValues } from '@/lib/validations/auction';
import { MyListingsType } from '@/lib/queries/auctions';

async function uploadFile(
  file: File,
  title: string,
  supabase: SupabaseClient,
): Promise<string | undefined> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return undefined;
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') return undefined;
  const { data, error } = await supabase.storage
    .from('auction-images')
    .upload(
      `${user.id}/${Date.now()}-${title.replace(/\s+/g, '-')}`,
      file,
    );
  if (error) return undefined;
  const { data: fileUrl } = supabase.storage
    .from('auction-images')
    .getPublicUrl(data.path);
  return fileUrl.publicUrl;
}

interface EditListingModalProps {
  listing: MyListingsType;
  open: boolean;
  onClose: () => void;
}

export function EditListingModal({
  listing,
  open,
  onClose,
}: EditListingModalProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<listingEditValues>({
    resolver: zodResolver(listingEditSchema),
    defaultValues: { title: listing.title, description: listing.description },
  });

  function onSubmit(data: listingEditValues) {
    startTransition(async () => {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, data.title, supabase);
        if (!imageUrl)
          toast.warning(
            'Image upload failed — listing will be updated without changing the image.',
          );
      }

      const result = await updateListing(
        listing.id,
        data.title,
        data.description,
        imageUrl,
      );

      if ('error' in result) {
        toast.error(result.error);
      } else {
        toast.success('Listing updated!');
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={errors.title ? 'true' : undefined}>
              <FieldLabel htmlFor='edit-title'>Title</FieldLabel>
              <Input
                id='edit-title'
                placeholder='Enter title'
                {...register('title')}
              />
              {errors.title && (
                <FieldError>{errors.title.message}</FieldError>
              )}
            </Field>
            <Field data-invalid={errors.description ? 'true' : undefined}>
              <FieldLabel htmlFor='edit-description'>Description</FieldLabel>
              <Input
                id='edit-description'
                placeholder='Enter description'
                {...register('description')}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
              <FieldDescription>Max 200 characters</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor='edit-image'>Image</FieldLabel>
              {listing.image_url && (
                <img
                  src={listing.image_url}
                  alt='Current listing image'
                  className='mb-2 h-24 w-full rounded-md object-cover'
                />
              )}
              <Input
                id='edit-image'
                type='file'
                accept='image/jpeg,image/png'
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
              <FieldDescription>
                Upload a new image to replace the current one.
              </FieldDescription>
            </Field>
            <Button
              type='submit'
              className='w-full'
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/listings/_components/EditListingModal.tsx
git commit -m "feat: add EditListingModal dialog with title/description/image form"
```

---

## Task 5: Build sortable table components

**Files:**
- Create: `app/dashboard/listings/_components/ListingsPageTable.tsx`
- Create: `app/dashboard/listings/_components/ListingsPageRow.tsx`

- [ ] **Step 1: Create `ListingsPageRow.tsx`**

```tsx
'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn, formatCurrency } from '@/lib/utils';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { closeSpecificAuction } from '@/lib/actions/closeAuction';
import { ExternalLink, Gavel, Lock, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ListingStatus,
  statusConfig,
} from '@/app/dashboard/_components/MyListings/types';
import { MyListingsType } from '@/lib/queries/auctions';

interface ListingsPageRowProps {
  listing: MyListingsType;
  onEdit: (listing: MyListingsType) => void;
}

export function ListingsPageRow({ listing, onEdit }: ListingsPageRowProps) {
  const timeLeft = useCountdown(listing.deadline, false, async () => {
    await closeSpecificAuction(listing.id);
  });

  const { label, dot, pill } =
    statusConfig[listing.status as ListingStatus] ?? statusConfig.closed;

  const locked = listing.bid_count > 0;

  return (
    <TableRow className='group/row'>
      <TableCell className='pl-5'>
        <span className='line-clamp-1 max-w-72 font-medium'>{listing.title}</span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
            pill,
          )}
        >
          <span className={cn('size-1.5 rounded-full', dot)} />
          {label}
        </span>
      </TableCell>
      <TableCell>
        <span className='ml-1 font-mono text-sm font-semibold tabular-nums'>
          {formatCurrency(listing.current_price ?? 0)}
        </span>
      </TableCell>
      <TableCell>
        <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Gavel className='size-3 shrink-0' />
          {listing.bid_count}
        </span>
      </TableCell>
      <TableCell>
        <span
          suppressHydrationWarning
          className={cn(
            'ml-1 font-mono text-xs tabular-nums',
            timeLeft.urgent
              ? 'animate-pulse text-destructive'
              : listing.status !== 'active'
                ? 'text-muted-foreground'
                : 'text-foreground',
          )}
        >
          {timeLeft.text}
        </span>
      </TableCell>
      <TableCell className='pr-5'>
        <div className='flex items-center justify-end gap-3'>
          {locked ? (
            <Lock className='size-3 text-muted-foreground/40' />
          ) : (
            <Button
              variant='ghost'
              size='sm'
              className='h-auto gap-1 px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-foreground'
              onClick={() => onEdit(listing)}
            >
              <Pencil className='size-3' />
              Edit
            </Button>
          )}
          <Link
            href={`/auctions/${listing.id}`}
            className='inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover/row:opacity-100'
          >
            View
            <ExternalLink className='size-3' />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
```

- [ ] **Step 2: Create `ListingsPageTable.tsx`**

```tsx
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ListingsPageRow } from './ListingsPageRow';
import { MyListingsType } from '@/lib/queries/auctions';

export type SortColumn =
  | 'title'
  | 'status'
  | 'current_price'
  | 'bid_count'
  | 'deadline';

export interface SortState {
  column: SortColumn | null;
  direction: 'asc' | 'desc';
}

interface ListingsPageTableProps {
  items: MyListingsType[];
  sort: SortState;
  onSort: (column: SortColumn) => void;
  onEdit: (listing: MyListingsType) => void;
}

interface ColumnDef {
  key: SortColumn;
  label: string;
  className?: string;
}

const COLUMNS: ColumnDef[] = [
  { key: 'title', label: 'Title', className: 'pl-5 w-1/3' },
  { key: 'status', label: 'Status' },
  { key: 'current_price', label: 'Current Price' },
  { key: 'bid_count', label: 'Bids' },
  { key: 'deadline', label: 'Time Left' },
];

function SortIcon({
  column,
  sort,
}: {
  column: SortColumn;
  sort: SortState;
}) {
  if (sort.column !== column)
    return (
      <ArrowUpDown className='ml-1 size-3 opacity-40 group-hover/col:opacity-70' />
    );
  return sort.direction === 'asc' ? (
    <ArrowUp className='ml-1 size-3' />
  ) : (
    <ArrowDown className='ml-1 size-3' />
  );
}

export function ListingsPageTable({
  items,
  sort,
  onSort,
  onEdit,
}: ListingsPageTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          {COLUMNS.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                'group/col cursor-pointer select-none text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                sort.column === col.key && 'text-foreground',
                col.className,
              )}
              onClick={() => onSort(col.key)}
            >
              <span className='inline-flex items-center'>
                {col.label}
                <SortIcon column={col.key} sort={sort} />
              </span>
            </TableHead>
          ))}
          <TableHead className='pr-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      {items.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={6}
              className='py-10 text-center text-sm text-muted-foreground'
            >
              No listings match your filters.
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {items.map((listing) => (
            <ListingsPageRow
              key={listing.id}
              listing={listing}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      )}
    </Table>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/listings/_components/ListingsPageTable.tsx app/dashboard/listings/_components/ListingsPageRow.tsx
git commit -m "feat: add sortable listings table and row components"
```

---

## Task 6: Build `ListingsPageContent` client component

**Files:**
- Create: `app/dashboard/listings/_components/ListingsPageContent.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Gavel } from 'lucide-react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterChip } from '@/components/ui/FitlerChip';
import { Card, CardContent } from '@/components/ui/card';
import {
  ListingsPageTable,
  SortColumn,
  SortState,
} from './ListingsPageTable';
import { ListingsPagination } from '@/app/dashboard/_components/MyListings/ListingsPagination';
import { EditListingModal } from './EditListingModal';
import { MyListingsType } from '@/lib/queries/auctions';
import { usePagination } from '@/lib/hooks/usePagination';

type StatusFilter = 'all' | 'active' | 'closed';
type PerformanceFilter = 'all' | 'has-bids' | 'no-bids';

function applySort(
  items: MyListingsType[],
  sort: SortState,
): MyListingsType[] {
  if (!sort.column) return items;
  const col = sort.column;
  return [...items].sort((a, b) => {
    const aVal = a[col];
    const bVal = b[col];
    let cmp: number;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      cmp = aVal.localeCompare(bVal);
    } else {
      cmp = (aVal as number) - (bVal as number);
    }
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}

export function ListingsPageContent({
  listings,
}: {
  listings: MyListingsType[];
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [perfFilter, setPerfFilter] = useState<PerformanceFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ column: null, direction: 'asc' });
  const [editingListing, setEditingListing] = useState<MyListingsType | null>(
    null,
  );

  const filtered = applySort(
    listings.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (perfFilter === 'has-bids' && l.bid_count === 0) return false;
      if (perfFilter === 'no-bids' && l.bid_count > 0) return false;
      if (
        query &&
        !l.title.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    }),
    sort,
  );

  const { page, pageSize, totalPages, setPage, changePageSize } =
    usePagination(filtered.length, 10);

  const currentItems = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function handleSort(column: SortColumn) {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' },
    );
    setPage(1);
  }

  const activeCount = listings.filter((l) => l.status === 'active').length;
  const closedCount = listings.filter((l) => l.status === 'closed').length;
  const hasBidsCount = listings.filter((l) => l.bid_count > 0).length;
  const noBidsCount = listings.filter((l) => l.bid_count === 0).length;

  const statusChips: {
    id: StatusFilter;
    label: string;
    count: number;
    activeColor: string;
  }[] = [
    {
      id: 'all',
      label: 'All',
      count: listings.length,
      activeColor: 'bg-primary text-background',
    },
    {
      id: 'active',
      label: 'Active',
      count: activeCount,
      activeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    },
    {
      id: 'closed',
      label: 'Closed',
      count: closedCount,
      activeColor: 'bg-muted text-muted-foreground',
    },
  ];

  const perfChips: {
    id: PerformanceFilter;
    label: string;
    count: number;
    activeColor: string;
  }[] = [
    {
      id: 'all',
      label: 'All',
      count: listings.length,
      activeColor: 'bg-primary text-background',
    },
    {
      id: 'has-bids',
      label: 'Has bids',
      count: hasBidsCount,
      activeColor: 'bg-primary/15 text-primary',
    },
    {
      id: 'no-bids',
      label: 'No bids',
      count: noBidsCount,
      activeColor: 'bg-muted text-muted-foreground',
    },
  ];

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <Link
          href='/dashboard'
          className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='size-3.5' />
          Back to dashboard
        </Link>
        <h1 className='font-heading text-3xl font-semibold'>My Listings</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your auction listings.
        </p>
      </div>

      <Card className='w-full overflow-hidden'>
        <CardContent className='p-0'>
          <div className='flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
              <div className='flex flex-wrap items-center gap-1.5'>
                {statusChips.map(({ id, label, count, activeColor }) => (
                  <Fragment key={id}>
                    <FilterChip
                      label={label}
                      count={count}
                      isActive={statusFilter === id}
                      activeColor={activeColor}
                      onClick={() => {
                        setStatusFilter(id);
                        setPage(1);
                      }}
                    />
                  </Fragment>
                ))}
              </div>
              <span className='text-xs text-muted-foreground/40'>·</span>
              <div className='flex flex-wrap items-center gap-1.5'>
                {perfChips.map(({ id, label, count, activeColor }) => (
                  <Fragment key={id}>
                    <FilterChip
                      label={label}
                      count={count}
                      isActive={perfFilter === id}
                      activeColor={activeColor}
                      onClick={() => {
                        setPerfFilter(id);
                        setPage(1);
                      }}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
            <div className='relative sm:w-64'>
              <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder='Search by title…'
                className='h-9 pl-9'
              />
            </div>
          </div>

          {listings.length === 0 ? (
            <div className='flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground'>
              <Gavel className='size-8 opacity-30' />
              <div className='text-center'>
                <p className='text-sm font-medium'>No listings yet</p>
                <Link
                  href='/auctions/new'
                  className='text-sm text-primary hover:underline'
                >
                  Create your first auction →
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ListingsPageTable
                items={currentItems}
                sort={sort}
                onSort={handleSort}
                onEdit={setEditingListing}
              />
              <ListingsPagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filtered.length}
                onPageChange={setPage}
                onPageSizeChange={changePageSize}
              />
            </>
          )}
        </CardContent>
      </Card>

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          open
          onClose={() => setEditingListing(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/listings/_components/ListingsPageContent.tsx
git commit -m "feat: add ListingsPageContent with filter chips, sort, pagination, and edit modal"
```

---

## Task 7: Build the server page and wire the dashboard link

**Files:**
- Create: `app/dashboard/listings/page.tsx`
- Modify: `app/dashboard/_components/MyListings/MyListingsCollapsible.tsx`

- [ ] **Step 1: Create `app/dashboard/listings/page.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server';
import { getMyListings } from '@/lib/queries/auctions';
import { toasts } from '@/components/shared/toast';
import { ListingsPageContent } from './_components/ListingsPageContent';

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: listings } = await getMyListings(user.id);

  if (!listings) {
    toasts.fetchError('your listings');
    return;
  }

  return (
    <div className='mx-16 my-10'>
      <ListingsPageContent listings={listings} />
    </div>
  );
}
```

- [ ] **Step 2: Add "View all listings →" link to `MyListingsCollapsible`**

In `app/dashboard/_components/MyListings/MyListingsCollapsible.tsx`, add a `Link` import and insert the link inside the `CollapsibleTrigger` div, next to the active count badge:

Find the trigger section:
```tsx
<div className='flex items-center gap-3'>
  <h2 className='font-heading text-xl font-semibold tracking-tight'>
    My Listings
  </h2>
  {activeCount > 0 && (
    <span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400'>
      {activeCount} active
    </span>
  )}
</div>
```

Replace with:
```tsx
<div className='flex items-center gap-3'>
  <h2 className='font-heading text-xl font-semibold tracking-tight'>
    My Listings
  </h2>
  {activeCount > 0 && (
    <span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400'>
      {activeCount} active
    </span>
  )}
  <Link
    href='/dashboard/listings'
    onClick={(e) => e.stopPropagation()}
    className='text-xs font-medium text-primary hover:underline'
  >
    View all →
  </Link>
</div>
```

Also add the `Link` import at the top of the file:
```tsx
import Link from 'next/link';
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 4: Start dev server and smoke-test**

```bash
npm run dev
```

Open `http://localhost:3000/dashboard/listings` and verify:
- Table renders with your listings
- Status chips (All/Active/Closed) filter the table correctly
- Performance chips (All/Has bids/No bids) filter correctly
- Title search filters as you type
- Clicking a column header sorts ascending; clicking again sorts descending; arrow icon appears
- Listings with `bid_count > 0` show a lock icon; others show an Edit button on row hover
- Clicking Edit opens the modal pre-filled with the listing's title and description
- Saving edits calls the server action and refreshes the page
- The dashboard's "My Listings" collapsible now shows a "View all →" link

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/listings/page.tsx app/dashboard/_components/MyListings/MyListingsCollapsible.tsx
git commit -m "feat: add My Listings page with filters, sorting, and edit modal"
```
