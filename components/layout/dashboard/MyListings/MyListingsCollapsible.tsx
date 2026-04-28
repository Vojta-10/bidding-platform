'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatCurrency } from '@/lib/utils';
import { ChevronDown, ExternalLink, Gavel, Plus } from 'lucide-react';
import Link from 'next/link';

type ListingStatus = 'active' | 'sold' | 'closed';

interface Listing {
  id: string;
  title: string;
  status: ListingStatus;
  currentPrice: number;
  bids: number;
  timeLeft: string;
  urgent?: boolean;
}

const listings: Listing[] = [
  {
    id: '1',
    title: 'Vintage Leica M3 Camera — 1954 Double Stroke',
    status: 'active',
    currentPrice: 1850,
    bids: 7,
    timeLeft: '1d 4h',
  },
  {
    id: '2',
    title: 'Eames Lounge Chair & Ottoman, Herman Miller',
    status: 'active',
    currentPrice: 3200,
    bids: 12,
    timeLeft: '03:42',
    urgent: true,
  },
  {
    id: '3',
    title: 'Gibson Les Paul Standard 1959 Reissue',
    status: 'sold',
    currentPrice: 5400,
    bids: 23,
    timeLeft: 'Ended',
  },
  {
    id: '4',
    title: 'Patek Philippe Calatrava Ref. 5227G',
    status: 'closed',
    currentPrice: 28000,
    bids: 4,
    timeLeft: 'Ended',
  },
];

const statusConfig: Record<
  ListingStatus,
  { label: string; dot: string; pill: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  sold: {
    label: 'Sold',
    dot: 'bg-green-500',
    pill: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-muted-foreground/40',
    pill: 'bg-muted text-muted-foreground',
  },
};

export default function MyListingsCollapsible() {
  const activeCount = listings.filter((l) => l.status === 'active').length;

  return (
    <Card className='w-full overflow-hidden p-4'>
      <CardContent className='p-0'>
        <Collapsible className='group' defaultOpen>
          <CollapsibleTrigger className='flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-muted/40 rounded-2xl'>
            <div className='flex items-center gap-3'>
              <h2 className='font-heading text-xl font-semibold tracking-tight'>
                My Listings
              </h2>
              {activeCount > 0 && (
                <span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400'>
                  {activeCount} active
                </span>
              )}
            </div>
            <ChevronDown className='size-4 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180' />
          </CollapsibleTrigger>

          <CollapsibleContent className='mt-4'>
            <div className='border-t border-border'>
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
                  {listings.map((listing) => {
                    const { label, dot, pill } = statusConfig[listing.status];
                    return (
                      <TableRow key={listing.id} className='group/row'>
                        <TableCell className='pl-5'>
                          <span className='line-clamp-1 max-w-[360] font-medium'>
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
                            <span
                              className={cn('size-1.5 rounded-full', dot)}
                            />
                            {label}
                          </span>
                        </TableCell>

                        <TableCell>
                          <span className='font-mono text-sm font-semibold tabular-nums ml-1'>
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
                              'font-mono text-xs tabular-nums ml-1',
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

              <div className='flex items-center justify-between border-t border-border px-5 py-3'>
                <p className='text-xs text-muted-foreground'>
                  {listings.length} listing{listings.length !== 1 ? 's' : ''}{' '}
                  total
                </p>
                <Link
                  href='/listings/new'
                  className='inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline'
                >
                  <Plus className='size-3' />
                  New listing
                </Link>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
