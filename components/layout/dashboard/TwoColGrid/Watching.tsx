'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FilterChip } from '../../../ui/FitlerChip';
import { BidsCarousel } from '../BidsCarousel';
import type { BidCardData } from '../BidCard';

type Filter = 'all' | 'ending-soon';

const MOCK_WATCHING: BidCardData[] = [
  {
    id: 'w1',
    title: 'Apple Vision Pro 256GB',
    imageGradient: 'bg-gradient-to-br from-slate-400 to-slate-600',
    currentPrice: 3200,
    deadline: new Date(Date.now() + 5 * 3600000).toISOString(),
  },
  {
    id: 'w2',
    title: 'Dyson Zone Absolute+ Headphones',
    imageGradient: 'bg-gradient-to-br from-purple-700 to-purple-950',
    currentPrice: 650,
    deadline: new Date(Date.now() + 22 * 3600000).toISOString(),
  },
  {
    id: 'w3',
    title: 'DJI Mavic 3 Pro Cine Premium Combo',
    imageGradient: 'bg-gradient-to-br from-gray-500 to-gray-800',
    currentPrice: 2100,
    deadline: new Date(Date.now() + 38 * 60000).toISOString(),
  },
  {
    id: 'w4',
    title: 'Omega Speedmaster Professional Moonwatch',
    imageGradient: 'bg-gradient-to-br from-zinc-600 to-zinc-900',
    currentPrice: 5400,
    deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
  },
  {
    id: 'w5',
    title: 'Hasselblad X2D 100C Medium Format Camera',
    imageGradient: 'bg-gradient-to-br from-stone-600 to-stone-900',
    currentPrice: 7800,
    deadline: new Date(Date.now() + 12 * 3600000).toISOString(),
  },
  {
    id: 'w6',
    title: 'Ferrari F40 Scale Model 1:8 Amalgam Collection',
    imageGradient: 'bg-gradient-to-br from-red-600 to-red-950',
    currentPrice: 1150,
    deadline: new Date(Date.now() + 48 * 3600000).toISOString(),
  },
  {
    id: 'w7',
    title: 'Leica Q3 43 Full-Frame Compact',
    imageGradient: 'bg-gradient-to-br from-neutral-600 to-neutral-900',
    currentPrice: 6200,
    deadline: new Date(Date.now() + 9 * 3600000).toISOString(),
  },
];

export default function Watching() {
  const [filter, setFilter] = useState<Filter>('all');
  const [urgentIds] = useState(
    () =>
      new Set(
        MOCK_WATCHING.filter(
          (b) => new Date(b.deadline).getTime() < Date.now() + 3_600_000,
        ).map((b) => b.id),
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
      count: MOCK_WATCHING.length,
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
      ? MOCK_WATCHING.filter((b) => urgentIds.has(b.id))
      : MOCK_WATCHING;

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
      <CardContent>
        <BidsCarousel bids={filtered} />
      </CardContent>
    </Card>
  );
}
