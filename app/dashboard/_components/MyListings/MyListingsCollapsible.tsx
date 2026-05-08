'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePagination } from '@/lib/hooks/usePagination';
import { ChevronDown } from 'lucide-react';
import { MOCK_LISTINGS } from './types';
import { ListingsTable } from './ListingsTable/ListingsTable';
import { ListingsPagination } from './ListingsPagination';

export default function MyListingsCollapsible() {
  const listings = MOCK_LISTINGS;
  const activeCount = listings.filter((l) => l.status === 'active').length;

  const { page, pageSize, totalPages, setPage, changePageSize } = usePagination(
    listings.length,
    5,
  );
  const currentItems = listings.slice((page - 1) * pageSize, page * pageSize);

  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [page]);

  return (
    <Card ref={cardRef} className='w-full overflow-hidden p-4'>
      <CardContent className='p-0'>
        <Collapsible className='group' defaultOpen>
          <CollapsibleTrigger className='flex w-full items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-muted/40'>
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
              <ListingsTable items={currentItems} />
              <ListingsPagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={listings.length}
                onPageChange={setPage}
                onPageSizeChange={changePageSize}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
