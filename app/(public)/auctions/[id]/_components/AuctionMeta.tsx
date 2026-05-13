'use client';
import { toasts } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { addToWatchlist, removeFromWatchlist } from '@/lib/actions/watchlist';
import { Binoculars } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AuctionMetaProps {
  title: string;
  description: string;
  seller: { username: string };
  createdAt: string;
  isWatched: boolean | undefined;
  auctionId: string;
}

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function AuctionMeta({
  title,
  description,
  seller,
  createdAt,
  isWatched,
  auctionId,
}: AuctionMetaProps) {
  const [watched, setWatched] = useState<boolean | undefined>(isWatched);

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex justify-between'>
        <h1 className='font-heading text-2xl font-semibold leading-tight tracking-tight'>
          {title}
        </h1>
        <Button
          variant={'outline'}
          className={watched ? 'border-primary' : ''}
          onClick={async () => {
            let res;
            if (watched) {
              res = await removeFromWatchlist(auctionId);
            } else {
              res = await addToWatchlist(auctionId);
            }
            if (!res.success) {
              toast.error(res.errorMessage);
              return;
            }
            if (watched) toasts.watchRemoved();
            else toasts.watchAdded();
            setWatched(!watched);
          }}
        >
          <Binoculars /> {watched ? 'Unwatch' : 'Watch'}
        </Button>
      </div>
      <p className='text-sm text-muted-foreground'>
        Listed by{' '}
        <span className='font-medium text-foreground'>@{seller.username}</span>
        {' · '}
        {formatRelativeDate(createdAt)}
      </p>
      <p className='text-sm text-muted-foreground leading-relaxed'>
        {description}
      </p>
    </div>
  );
}
