import { AuctionCard } from './AuctionCard';
import { FilterPanel } from './FilterPanel';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { BrowseBids } from '@/lib/queries/auctions';
import SortPanel from './SortPanel';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BrowsePage({
  auctions,
  activeFilterCount,
}: {
  auctions: BrowseBids[];
  activeFilterCount: number;
}) {
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14'>
      {/* Page header */}
      <div className='mb-8 pb-6 border-b border-border'>
        <h1 className='font-heading text-3xl sm:text-4xl font-bold tracking-tight'>
          Browse Auctions
        </h1>
        <p className='mt-1.5 text-sm text-muted-foreground'>
          Discover rare items — bid, win, and collect.
        </p>
      </div>

      {/* Controls bar */}
      <div className='flex items-center justify-between mb-6 gap-4'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-medium text-foreground tabular-nums'>
            {auctions.length}
          </span>{' '}
          result{auctions.length !== 1 ? 's' : ''}
          {activeFilterCount > 0 && (
            <span className='ml-1.5 text-xs text-primary'>(filtered)</span>
          )}
        </p>

        <div className='flex items-center gap-3'>
          <SortPanel />

          {/* Mobile filter button */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2 text-xs h-8'
                  />
                }
              >
                <SlidersHorizontal className='size-3.5' />
                Filters
                {activeFilterCount > 0 && (
                  <span className='flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
                    {activeFilterCount}
                  </span>
                )}
              </SheetTrigger>
              <SheetContent side='left' className='p-4'>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className='px-1 overflow-y-auto'>
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='flex gap-8'>
        {/* Sidebar — desktop only */}
        <aside className='hidden lg:block w-56 shrink-0'>
          <div className='sticky top-6 rounded-xl border border-border bg-card p-4'>
            <FilterPanel />
          </div>
        </aside>

        {/* Grid */}
        <div className='flex-1 min-w-0'>
          {auctions.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='rounded-full bg-muted p-4 mb-4'>
                <Search className='size-6 text-muted-foreground' />
              </div>
              <p className='font-medium text-sm'>No auctions found</p>
              <p className='mt-1 text-xs text-muted-foreground max-w-[28ch]'>
                Try adjusting your filters or clearing the search.
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: 'secondary' }),
                  'mt-4 text-xs tracking-wide',
                )}
                href={'/auctions'}
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
