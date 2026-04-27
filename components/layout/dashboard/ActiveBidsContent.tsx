'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Gavel } from 'lucide-react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BidsCarousel } from './BidsCarousel';
import type { BidCardData } from './BidCard';

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

  const chips: { id: Filter; label: string; count: number; bgColor: string }[] =
    [
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
      },
      {
        id: 'ending-soon',
        label: 'Ending soon',
        count: endingSoonCount,
        bgColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      },
    ];

  return (
    <>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <h2 className='font-heading text-xl font-semibold mr-2'>
            Active Bids
          </h2>
          <div className='flex items-center gap-2.5'>
            {chips.map(({ id, label, count, bgColor }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                  filter === id
                    ? bgColor
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                )}
              >
                {id === 'outbid' && filter === id && (
                  <span className='size-1.5 rounded-full bg-destructive' />
                )}
                {id === 'ending-soon' && filter === id && (
                  <span className='size-1.5 rounded-full bg-amber-500' />
                )}
                {label}
                <span
                  className={cn(
                    'rounded-full px-1 tabular-nums',
                    filter === id ? 'opacity-75' : 'opacity-60',
                  )}
                >
                  {count}
                </span>
              </button>
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
