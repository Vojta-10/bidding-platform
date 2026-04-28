'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Gavel } from 'lucide-react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { FilterChip } from '../Chip';
import { BidsCarousel } from '../BidsCarousel';
import type { BidCardData } from '../BidCard';

type Filter = 'all' | 'outbid' | 'ending-soon';

interface ActiveBidsContentProps {
  bids: BidCardData[];
}

export function ActiveBidsContent({ bids }: ActiveBidsContentProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const [urgentIds] = useState(() => {
    const threshold = Date.now() + 3_600_000;
    return new Set(
      bids
        .filter((b) => new Date(b.deadline).getTime() < threshold)
        .map((b) => b.id),
    );
  });

  const outbidCount = bids.filter((b) => b.status === 'outbid').length;
  const endingSoonCount = urgentIds.size;

  const filtered = bids.filter((b) => {
    if (filter === 'outbid') return b.status === 'outbid';
    if (filter === 'ending-soon') return urgentIds.has(b.id);
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
    <>
      <CardHeader>
        <div className='flex flex-col gap-2 px-2 sm:flex-row sm:items-center'>
          <h2 className='font-heading text-2xl font-semibold mr-2'>
            Active Bids
          </h2>
          <div className='flex flex-wrap items-center gap-2'>
            {chips.map(({ id, label, count, bgColor, dotColor }) => (
              <Fragment key={id}>
                {id === 'ending-soon' && (
                  <span
                    className='hidden max-[460px]:block max-[460px]:w-full'
                    aria-hidden
                  />
                )}
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
        </div>
      </CardHeader>

      <CardContent>
        {filtered.length === 0 ? (
          <div className='flex h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground'>
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
                <p className='text-sm font-medium'>
                  No{' '}
                  {filter === 'outbid'
                    ? 'outbid'
                    : filter === 'ending-soon'
                      ? 'ending soon'
                      : ''}{' '}
                  bids
                </p>
              )}
            </div>
          </div>
        ) : (
          <BidsCarousel bids={filtered} />
        )}
      </CardContent>
    </>
  );
}
