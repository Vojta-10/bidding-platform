'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Gavel, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterChip } from '@/components/ui/FitlerChip';
import { BidCard } from '@/app/dashboard/_components/BidCard';
import { activeBidsType } from '@/lib/queries/auctions';

type Filter = 'all' | 'outbid' | 'ending-soon';

export function ActiveBidsTab({ bids }: { bids: activeBidsType[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const [urgentIds] = useState(() => {
    const threshold = Date.now() + 3_600_000;
    return new Set(
      bids
        .filter((b) => new Date(b.auctions.deadline).getTime() < threshold)
        .map((b) => b.auction_id),
    );
  });

  const outbidCount = bids.filter(
    (b) => b.amount !== b.auctions.current_price,
  ).length;
  const endingSoonCount = urgentIds.size;

  const filtered = bids.filter((b) => {
    if (filter === 'outbid' && b.amount === b.auctions.current_price)
      return false;
    if (filter === 'ending-soon' && !urgentIds.has(b.auction_id)) return false;
    if (query && !b.auctions.title.toLowerCase().includes(query.toLowerCase()))
      return false;
    return true;
  });

  const chips: {
    id: Filter;
    label: string;
    count: number;
    bgColor: string;
    dotColor?: string;
  }[] = [
    {
      id: 'all',
      label: 'All',
      count: bids.length,
      bgColor: 'bg-primary text-background',
    },
    {
      id: 'outbid',
      label: 'Outbid',
      count: outbidCount,
      bgColor: 'bg-destructive/15 text-destructive',
      dotColor: 'bg-destructive',
    },
    {
      id: 'ending-soon',
      label: 'Ending soon',
      count: endingSoonCount,
      bgColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      dotColor: 'bg-amber-500',
    },
  ];

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          {chips.map(({ id, label, count, bgColor, dotColor }) => (
            <Fragment key={id}>
              <FilterChip
                label={label}
                count={count}
                isActive={filter === id}
                activeColor={bgColor}
                dotColor={dotColor}
                onClick={() => setFilter(id)}
              />
            </Fragment>
          ))}
        </div>
        <div className='relative sm:w-64'>
          <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by title…'
            className='h-9 pl-9'
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground'>
          <Gavel className='size-8 opacity-30' />
          <div className='text-center'>
            {bids.length === 0 ? (
              <>
                <p className='text-sm font-medium'>No active bids</p>
                <Link
                  href='/auctions'
                  className='text-sm text-primary hover:underline'
                >
                  Browse auctions →
                </Link>
              </>
            ) : (
              <p className='text-sm font-medium'>No bids match your filters</p>
            )}
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {filtered.map((bid) => (
            <BidCard key={bid.auction_id} bid={bid} variant='grid' />
          ))}
        </div>
      )}
    </div>
  );
}
