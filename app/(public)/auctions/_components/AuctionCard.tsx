'use client';

import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn, calcTimeLeft, formatCurrency } from '@/lib/utils';
import { Clock, ImageIcon, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BrowseBids } from '@/lib/queries/auctions';

export function AuctionCard({ auction }: { auction: BrowseBids }) {
  const timeLeft = calcTimeLeft(auction.deadline);
  const isEnded = auction.status === 'closed';

  return (
    <Card
      className={cn(
        'gap-0 py-0 overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
        !isEnded && timeLeft.urgent && 'ring-1 ring-destructive/40',
      )}
    >
      <div className='relative aspect-4/3 bg-muted flex items-center justify-center overflow-hidden'>
        {auction.image_url ? (
          <Image
            src={auction.image_url}
            alt={auction.title}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <ImageIcon className='size-10 text-muted-foreground/20' />
        )}

        <div
          className={cn(
            'absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm bg-background/80',
            isEnded ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          <span
            className={cn(
              'size-1.5 rounded-full',
              isEnded ? 'bg-muted-foreground' : 'bg-green-500 animate-pulse',
            )}
          />
          {isEnded ? 'Ended' : 'Live'}
        </div>

        <div
          className={cn(
            'absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm',
            isEnded
              ? 'bg-background/80 text-muted-foreground'
              : timeLeft.urgent
                ? 'bg-destructive text-white'
                : 'bg-background/80 text-foreground',
          )}
        >
          <Clock className='size-3' />
          {timeLeft.text}
        </div>
      </div>

      <CardContent className='p-4 flex flex-col gap-3'>
        <div>
          <p className='font-medium leading-snug line-clamp-2 text-sm'>
            {auction.title}
          </p>
          <p className='mt-1 text-xs text-muted-foreground line-clamp-1'>
            {auction.description}
          </p>
        </div>

        <div className='flex items-end justify-between'>
          <div>
            <p className='text-xs text-muted-foreground'>
              {isEnded ? 'Final price' : 'Current bid'}
            </p>
            <p
              className={cn(
                'text-lg font-bold tabular-nums leading-none',
                isEnded ? 'text-foreground' : 'text-primary',
              )}
            >
              {formatCurrency(auction.current_price)}
            </p>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <TrendingUp className='size-3' />
            {auction.bid_count} bids
          </div>
        </div>

        <Link
          href={`/auctions/${auction.id}`}
          className={cn(
            buttonVariants({
              size: 'sm',
              variant: isEnded ? 'outline' : 'default',
            }),
            'w-full',
          )}
        >
          {isEnded ? 'View Results' : 'Place Bid'}
        </Link>
      </CardContent>
    </Card>
  );
}
