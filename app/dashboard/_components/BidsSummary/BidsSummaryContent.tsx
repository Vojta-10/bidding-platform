'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gavel, ArrowRight } from 'lucide-react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FilterChip } from '@/components/ui/FitlerChip';
import { BidCard } from '../BidCard';
import { activeBidsType } from '@/lib/queries/auctions';

type Filter = 'winning' | 'losing';

export function BidsSummaryContent({ bids }: { bids: activeBidsType[] }) {
  const [filter, setFilter] = useState<Filter>('winning');

  const winningCount = bids.filter(
    (b) => b.amount === b.auctions.current_price,
  ).length;
  const losingCount = bids.length - winningCount;

  const filtered = bids.filter((b) =>
    filter === 'winning'
      ? b.amount === b.auctions.current_price
      : b.amount !== b.auctions.current_price,
  );

  const chips: {
    id: Filter;
    label: string;
    count: number;
    bgColor: string;
    dotColor: string;
  }[] = [
    {
      id: 'winning',
      label: 'Winning',
      count: winningCount,
      bgColor: 'bg-green-500/15 text-green-700 dark:text-green-400',
      dotColor: 'bg-green-500',
    },
    {
      id: 'losing',
      label: 'Losing',
      count: losingCount,
      bgColor: 'bg-destructive/15 text-destructive',
      dotColor: 'bg-destructive',
    },
  ];

  return (
    <>
      <CardHeader>
        <div className='flex flex-col gap-2 px-2 sm:flex-row sm:items-center'>
          <h2 className='font-heading text-2xl font-semibold mr-2'>
            Active Bids
          </h2>
          <div className='flex flex-wrap items-center gap-2'>
            {chips.map(({ id, label, count, bgColor, dotColor }) => (
              <FilterChip
                key={id}
                label={label}
                count={count}
                isActive={filter === id}
                activeColor={bgColor}
                dotColor={dotColor}
                onClick={() => setFilter(id)}
              />
            ))}
          </div>
          <Link
            href='/dashboard/bids'
            className='group ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
          >
            View all bids
            <ArrowRight className='size-3.5 transition-transform group-hover:translate-x-0.5' />
          </Link>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {bids.length === 0 ? (
          <div className='flex h-40 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <Gavel className='size-8 opacity-30' />
            <div className='text-center'>
              <p className='text-sm font-medium'>No active bids</p>
              <Link
                href='/auctions'
                className='text-sm text-primary hover:underline'
              >
                Browse auctions →
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className='flex h-40 flex-col items-center justify-center gap-3 text-muted-foreground'>
            <Gavel className='size-8 opacity-30' />
            <p className='text-sm font-medium'>No {filter} bids</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-3 px-2 sm:grid-cols-3 lg:grid-cols-5'>
            {filtered.map((bid) => (
              <BidCard key={bid.auction_id} bid={bid} variant='grid' />
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}
