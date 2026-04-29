import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrency } from '@/lib/utils';
import { ExternalLink, Gavel } from 'lucide-react';
import Link from 'next/link';
import { type Listing, statusConfig } from './types';

export function ListingsTable({ items }: { items: Listing[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead className='pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Title
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Status
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Current Price
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Bids
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Time Left
          </TableHead>
          <TableHead className='pr-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((listing) => {
          const { label, dot, pill } = statusConfig[listing.status];
          return (
            <TableRow key={listing.id} className='group/row'>
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
                  className={cn(
                    'ml-1 font-mono text-xs tabular-nums',
                    listing.urgent
                      ? 'animate-pulse text-destructive'
                      : listing.status !== 'active'
                        ? 'text-muted-foreground'
                        : 'text-foreground',
                  )}
                >
                  {listing.timeLeft}
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
        })}
      </TableBody>
    </Table>
  );
}
