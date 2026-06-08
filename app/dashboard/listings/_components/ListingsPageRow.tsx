'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn, formatCurrency } from '@/lib/utils';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { closeSpecificAuction } from '@/lib/actions/closeAuction';
import { ExternalLink, Gavel, Lock, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ListingStatus,
  statusConfig,
} from '@/app/dashboard/_components/MyListings/types';
import { MyListingsType } from '@/lib/queries/auctions';

interface ListingsPageRowProps {
  listing: MyListingsType;
  onEdit: (listing: MyListingsType) => void;
}

export function ListingsPageRow({ listing, onEdit }: ListingsPageRowProps) {
  const router = useRouter();
  const timeLeft = useCountdown(listing.deadline, false, async () => {
    await closeSpecificAuction(listing.id);
    router.refresh();
  });

  const { label, dot, pill } =
    statusConfig[listing.status as ListingStatus] ?? statusConfig.closed;

  const locked = listing.bid_count > 0;

  return (
    <TableRow className='group/row'>
      <TableCell className='pl-5'>
        <span className='line-clamp-1 max-w-72 font-medium'>{listing.title}</span>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
            pill,
          )}
        >
          <span className={cn('size-1.5 rounded-full', dot)} />
          {label}
        </span>
      </TableCell>
      <TableCell>
        <span className='ml-1 font-mono text-sm font-semibold tabular-nums'>
          {formatCurrency(listing.current_price ?? 0)}
        </span>
      </TableCell>
      <TableCell>
        <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Gavel className='size-3 shrink-0' />
          {listing.bid_count}
        </span>
      </TableCell>
      <TableCell>
        <span
          suppressHydrationWarning
          className={cn(
            'ml-1 font-mono text-xs tabular-nums',
            timeLeft.urgent
              ? 'animate-pulse text-destructive'
              : listing.status !== 'active'
                ? 'text-muted-foreground'
                : 'text-foreground',
          )}
        >
          {timeLeft.text}
        </span>
      </TableCell>
      <TableCell className='pr-5'>
        <div className='flex items-center justify-end gap-3'>
          {locked ? (
            <Lock className='size-3 text-muted-foreground/40' />
          ) : (
            <Button
              variant='ghost'
              size='sm'
              className='h-auto gap-1 px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-foreground'
              onClick={() => onEdit(listing)}
            >
              <Pencil className='size-3' />
              Edit
            </Button>
          )}
          <Link
            href={`/auctions/${listing.id}`}
            className='inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover/row:opacity-100'
          >
            View
            <ExternalLink className='size-3' />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
