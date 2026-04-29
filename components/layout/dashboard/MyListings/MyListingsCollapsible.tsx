'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { MOCK_LISTINGS } from './types';
import { ListingsTable } from './ListingsTable';
import { ListingsPagination } from './ListingsPagination';

const DEFAULT_PAGE_SIZE = 5;

export default function MyListingsCollapsible() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const listings = MOCK_LISTINGS;
  const activeCount = listings.filter((l) => l.status === 'active').length;
  const totalPages = Math.max(1, Math.ceil(listings.length / pageSize));
  const currentItems = listings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  return (
    <Card className='w-full overflow-hidden p-4'>
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
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={listings.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
