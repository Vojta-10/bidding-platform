'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, Gavel } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatCurrency, calcTimeLeft } from '@/lib/utils';

export interface BidCardData {
  id: string;
  title: string;
  imageGradient: string;
  currentPrice: number;
  yourBid?: number;
  deadline: string;
  status?: 'winning' | 'outbid';
}

export function BidCard({ bid }: { bid: BidCardData }) {
  const winning = bid.status === 'winning';
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(bid.deadline));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(bid.deadline)), 1000);
    return () => clearInterval(id);
  }, [bid.deadline]);

  const { urgent } = timeLeft;

  return (
    <Card
      className={cn(
        'w-52 shrink-0 gap-0 overflow-hidden py-0 transition-all hover:shadow-md sm:w-64',
        urgent && 'ring-destructive/50',
      )}
    >
      <div className={cn('relative h-36 w-full sm:h-44', bid.imageGradient)}>
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

      <CardContent className='flex flex-col gap-2 p-2.5 sm:gap-3 sm:p-3'>
        <p className='line-clamp-2 h-10 text-sm font-medium leading-snug'>
          {bid.title}
        </p>

        <div className='flex items-end justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>Current</p>
            <p className='text-sm font-bold tabular-nums sm:text-base'>
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
                  urgent
                    ? 'animate-pulse text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {timeLeft.text}
              </span>
            </div>
            {bid.yourBid !== undefined && (
              <p className='text-xs text-muted-foreground'>
                Your bid: {formatCurrency(bid.yourBid)}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between'>
          {bid.status !== undefined ? (
            <>
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
            </>
          ) : (
            <Link
              href={`/auctions/${bid.id}`}
              className={cn(buttonVariants({ size: 'xs' }), 'gap-1')}
            >
              <Gavel className='size-3' />
              Place Bid
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
