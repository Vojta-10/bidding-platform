'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';

export interface BidCardData {
  id: string;
  title: string;
  imageGradient: string;
  currentPrice: number;
  yourBid: number;
  deadline: string;
  status: 'winning' | 'outbid';
}

function calcTimeLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { text: 'Ended', urgent: false };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (days > 0) return { text: `${days}d ${hours}h`, urgent: false };
  if (hours > 0) return { text: `${hours}h ${minutes}m`, urgent: false };
  return {
    text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    urgent: true,
  };
}

export function BidCard({ bid }: { bid: BidCardData }) {
  const winning = bid.status === 'winning';
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(bid.deadline));

  useEffect(() => {
    const id = setInterval(
      () => setTimeLeft(calcTimeLeft(bid.deadline)),
      1000,
    );
    return () => clearInterval(id);
  }, [bid.deadline]);

  const { urgent } = timeLeft;

  return (
    <Card
      className={cn(
        'w-64 shrink-0 gap-0 overflow-hidden py-0 transition-all hover:shadow-md',
        urgent && 'ring-destructive/50',
      )}
    >
      {/* Image */}
      <div className={cn('relative h-44 w-full', bid.imageGradient)}>
        {urgent && (
          <div className='absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-1 backdrop-blur-sm'>
            <span className='relative flex size-2 shrink-0'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75' />
              <span className='relative inline-flex size-2 rounded-full bg-destructive' />
            </span>
            <span className='text-[10px] font-semibold uppercase tracking-wider text-white'>
              Ending soon
            </span>
          </div>
        )}
      </div>

      <CardContent className='flex flex-col gap-3 p-3'>
        {/* Title */}
        <p className='line-clamp-2 h-10 text-sm font-medium leading-snug'>
          {bid.title}
        </p>

        {/* Price + countdown */}
        <div className='flex items-end justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Current</p>
            <p className='text-base font-bold tabular-nums'>
              {formatCurrency(bid.currentPrice)}
            </p>
          </div>
          <div className='flex flex-col items-end gap-0.5'>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <Clock className='size-3' />
              <span
                suppressHydrationWarning
                className={cn(
                  'font-mono text-xs font-medium tabular-nums',
                  urgent ? 'animate-pulse text-destructive' : 'text-muted-foreground',
                )}
              >
                {timeLeft.text}
              </span>
            </div>
            <p className='text-xs text-muted-foreground'>
              Your bid: {formatCurrency(bid.yourBid)}
            </p>
          </div>
        </div>

        {/* Status + CTA */}
        <div className='flex items-center justify-between'>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              winning
                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-destructive/10 text-destructive',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                winning ? 'bg-green-500' : 'bg-destructive',
              )}
            />
            {winning ? 'Winning' : 'Outbid'}
          </span>

          {!winning && (
            <Link
              href={`/auctions/${bid.id}`}
              className={cn(buttonVariants({ size: 'xs' }), 'gap-1')}
            >
              <TrendingUp className='size-3' />
              Raise Bid
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
