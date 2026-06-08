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
