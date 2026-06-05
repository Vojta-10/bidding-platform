'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getPageNumbers } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE_OPTIONS = [5, 10, 25];

interface ListingsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ListingsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: ListingsPaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className='grid grid-cols-1 grid-rows-3 gap-1 lg:grid-cols-3 lg:grid-rows-1 border-t border-border px-5 py-5 mt-2'>
      <div className='flex items-center gap-3 justify-self-start'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className='rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring'
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <span className='text-xs text-muted-foreground/50'>·</span>
        <span className='text-xs text-muted-foreground'>
          {totalItems} listing{totalItems !== 1 ? 's' : ''} total
        </span>
      </div>

      <div className='flex items-center justify-around gap-4 justify-self-center'>
        {totalPages > 1 && (
          <Pagination className='mx-0 w-auto'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {pages.map((page, i) =>
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href='#'
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Link
        href='/auctions/new'
        className='inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline justify-self-center lg:justify-self-end'
      >
        <Plus className='size-3' />
        New listing
      </Link>
    </div>
  );
}
