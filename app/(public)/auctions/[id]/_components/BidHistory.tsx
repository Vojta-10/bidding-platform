'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { cn, formatCurrency, getPageNumbers } from '@/lib/utils';
import { usePagination } from '@/lib/hooks/usePagination';
import { ChevronLeft, ChevronRight, Gavel } from 'lucide-react';
import { bidsType } from '@/lib/queries/auctions';
import { useRealtimeBids } from '@/lib/hooks/useRealtimeBids';

const PAGE_SIZE = 5;

interface BidHistoryProps {
  initialBids: bidsType[];
  auctionId: string;
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function BidHistory({ initialBids, auctionId }: BidHistoryProps) {
  const newBids = useRealtimeBids(initialBids, auctionId);
  const {
    page,
    pageSize,
    totalPages,
    setPage,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
  } = usePagination(newBids.length, PAGE_SIZE);

  const pageBids = newBids.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section>
      <div className='mb-4 flex items-center gap-3'>
        <h2 className='font-heading text-lg font-semibold'>Bid History</h2>
        {newBids.length > 0 && (
          <span className='inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary tabular-nums'>
            {newBids.length}
          </span>
        )}
      </div>

      {newBids.length === 0 ? (
        <div className='flex flex-col items-center gap-3 py-14 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
            <Gavel className='size-6 text-muted-foreground' />
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>No bids yet</p>
            <p className='text-xs text-muted-foreground'>
              Be the first to place a bid!
            </p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          <Card className='gap-0 overflow-hidden py-0'>
            {pageBids.map((bid, localIndex) => {
              const globalRank = (page - 1) * pageSize + localIndex + 1;
              return (
                <div
                  key={bid.id}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    localIndex !== pageBids.length - 1 &&
                      'border-b border-border',
                    globalRank === 1 && 'bg-primary/5',
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <span
                      className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        globalRank === 1
                          ? 'bg-primary text-[10px] text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {globalRank}
                    </span>
                    <span className='text-sm font-medium'>
                      @{bid.profiles.username}
                    </span>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm font-bold text-primary tabular-nums'>
                      {formatCurrency(bid.amount)}
                    </span>
                    <span
                      suppressHydrationWarning
                      className='min-w-15 text-right text-xs tabular-nums text-muted-foreground'
                    >
                      {formatTimeAgo(bid.created_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </Card>

          {totalPages > 1 && (
            <Pagination className='justify-center'>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={goPrev}
                    disabled={!canGoPrev}
                    className='gap-1 pl-1.5'
                  >
                    <ChevronLeft className='size-4' />
                    Previous
                  </Button>
                </PaginationItem>

                {getPageNumbers(page, totalPages).map((p, i) => (
                  <PaginationItem key={i}>
                    {p === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <Button
                        variant={p === page ? 'outline' : 'ghost'}
                        size='icon'
                        onClick={() => setPage(p)}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </Button>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={goNext}
                    disabled={!canGoNext}
                    className='gap-1 pr-1.5'
                  >
                    Next
                    <ChevronRight className='size-4' />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </section>
  );
}
