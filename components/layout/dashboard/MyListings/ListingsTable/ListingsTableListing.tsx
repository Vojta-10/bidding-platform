'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Listing, statusConfig } from '../types';
import { calcTimeLeft, cn, formatCurrency } from '@/lib/utils';
import { ExternalLink, Gavel } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
interface TableListingProps {
  listing: Listing;
}

export default function TableListing({ listing }: TableListingProps) {
  const { label, dot, pill } = statusConfig[listing.status];
  const [timeLeft, setTimeLeft] = useState(() =>
    calcTimeLeft(listing.deadline),
  );

  useEffect(() => {
    if (timeLeft.text === 'Ended') return;
    const id = setInterval(
      () => setTimeLeft(calcTimeLeft(listing.deadline)),
      1000,
    );
    return () => clearInterval(id);
  }, [listing.deadline, timeLeft.text]);

  return (
    <TableRow className='group/row'>
      <TableCell className='pl-5'>
        <span className='line-clamp-1 max-w-90 font-medium'>
          {listing.title}
        </span>
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
          {formatCurrency(listing.currentPrice)}
        </span>
      </TableCell>

      <TableCell>
        <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
          <Gavel className='size-3 shrink-0' />
          {listing.bids}
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

      <TableCell className='pr-5 text-right'>
        <Link
          href={`/auctions/${listing.id}`}
          className='inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover/row:opacity-100'
        >
          View
          <ExternalLink className='size-3' />
        </Link>
      </TableCell>
    </TableRow>
  );
}
