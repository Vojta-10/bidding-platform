'use client';

import { useState } from 'react';
import { History, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterChip } from '@/components/ui/FitlerChip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BidCard } from '@/app/dashboard/_components/BidCard';
import { historyBidsType } from '@/lib/queries/auctions';

type Filter = 'all' | 'won' | 'lost';
type TimeRange = 'all' | 'this-month' | 'this-year';

const TIME_LABELS: Record<TimeRange, string> = {
  all: 'All time',
  'this-month': 'This month',
  'this-year': 'This year',
};

export function HistoryBidsTab({ bids }: { bids: historyBidsType[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [time, setTime] = useState<TimeRange>('all');
  const [query, setQuery] = useState('');

  const wonCount = bids.filter((b) => b.won).length;
  const lostCount = bids.length - wonCount;

  const now = new Date();
  const filtered = bids.filter((b) => {
    if (filter === 'won' && !b.won) return false;
    if (filter === 'lost' && b.won) return false;

    if (time !== 'all') {
      const ended = new Date(b.auctions.deadline);
      if (ended.getUTCFullYear() !== now.getUTCFullYear()) return false;
      if (time === 'this-month' && ended.getUTCMonth() !== now.getUTCMonth())
        return false;
    }

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
      id: 'won',
      label: 'Won',
      count: wonCount,
      bgColor: 'bg-green-500/15 text-green-700 dark:text-green-400',
      dotColor: 'bg-green-500',
    },
    {
      id: 'lost',
      label: 'Lost',
      count: lostCount,
      bgColor: 'bg-destructive/15 text-destructive',
      dotColor: 'bg-destructive',
    },
  ];

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
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
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Select
            items={TIME_LABELS}
            value={time}
            onValueChange={(value) => setTime(value as TimeRange)}
          >
            <SelectTrigger className='h-9 w-full sm:w-36'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All time</SelectItem>
              <SelectItem value='this-month'>This month</SelectItem>
              <SelectItem value='this-year'>This year</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      {filtered.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-muted-foreground'>
          <History className='size-8 opacity-30' />
          <p className='text-sm font-medium'>
            {bids.length === 0
              ? 'No past bids yet'
              : 'No bids match your filters'}
          </p>
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
