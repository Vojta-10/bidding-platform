'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FilterChip } from '../../../../components/ui/FitlerChip';
import { BidsCarousel } from '../BidsCarousel';
import { dashboardBids } from '@/lib/queries/auctions';
import { Binoculars } from 'lucide-react';
import { Subtitle } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';


type Filter = 'all' | 'ending-soon';

export default function Watching({
  watchlistAuctions,
}: {
  watchlistAuctions: dashboardBids[];
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [urgentIds] = useState(
    () =>
      new Set(
        watchlistAuctions
          .filter(
            (b) =>
              new Date(b.auctions.deadline).getTime() < Date.now() + 3_600_000,
          )
          .map((b) => b.auction_id),
      ),
  );

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
      count: watchlistAuctions.length,
      bgColor: 'bg-primary text-background',
    },
    {
      id: 'ending-soon',
      label: 'Ending soon',
      count: urgentIds.size,
      bgColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      dotColor: 'bg-amber-500',
    },
  ];

  const filtered =
    filter === 'ending-soon'
      ? watchlistAuctions.filter((b) => urgentIds.has(b.auction_id))
      : watchlistAuctions;

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-2 px-2 sm:flex-row sm:items-center'>
          <h2 className='font-heading text-2xl font-semibold mr-2'>Watching</h2>
          <div className='flex items-center gap-2'>
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
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {watchlistAuctions.length > 0 ? (
          <BidsCarousel bids={filtered} />
        ) : (
          <div className='flex flex-col gap-3 justify-center items-center h-82.5'>
            <Binoculars />
            <Subtitle>No bids on your watchlist!</Subtitle>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
