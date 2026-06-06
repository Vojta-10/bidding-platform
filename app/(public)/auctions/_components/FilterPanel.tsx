'use client';

import { Input } from '@/components/ui/input';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { filterType } from '@/lib/queries/auctions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export type StatusFilter = 'all' | 'active' | 'closed';
export type DeadlineFilter = 'any' | 'today' | 'week' | 'ended';

export interface Filters {
  search: string;
  status: StatusFilter;
  priceMin: string;
  priceMax: string;
  deadline: DeadlineFilter;
}

export const DEFAULT_FILTERS: Filters = {
  search: '',
  status: 'all',
  priceMin: '',
  priceMax: '',
  deadline: 'any',
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible className='group' defaultOpen>
      <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md px-1 py-2 text-sm font-medium hover:bg-muted/50 transition-colors'>
        {title}
        <ChevronDown className='size-3.5 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180' />
      </CollapsibleTrigger>
      <CollapsibleContent className='px-1 pb-3 pt-0.5'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function FilterPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState<filterType>({
    query: searchParams.get('query') || '',
    statusOption: searchParams.get('statusOption') || 'all',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    deadline: searchParams.get('deadline') || 'any',
  });

  const resetFilters = () => {
    setFilter({
      query: '',
      statusOption: 'all',
      priceMin: '',
      priceMax: '',
      deadline: 'any',
    });
    router.push(pathname);
  };

  const hasActiveFilters =
    searchParams.get('query') !== null ||
    filter.query !== '' ||
    searchParams.get('statusOption') !== null ||
    filter.statusOption !== 'all' ||
    searchParams.get('priceMin') !== null ||
    filter.priceMin !== '' ||
    searchParams.get('priceMax') !== null ||
    filter.priceMax !== '' ||
    searchParams.get('deadline') !== null ||
    filter.deadline !== 'any';

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'closed', label: 'Ended' },
  ];

  const deadlineOptions: { value: DeadlineFilter; label: string }[] = [
    { value: 'any', label: 'Any time' },
    { value: 'today', label: 'Ending today' },
    { value: 'week', label: 'This week' },
    { value: 'ended', label: 'Already ended' },
  ];

  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between px-1 pb-3'>
        <h3 className='font-heading text-sm font-semibold tracking-tight'>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='size-3' />
            Clear all
          </button>
        )}
      </div>

      <FilterSection title='Search'>
        <div className='relative'>
          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none' />
          <Input
            placeholder='Search listings…'
            value={filter.query}
            onChange={(e) => {
              setFilter({
                ...filter,
                query: e.target.value,
              });
            }}
            className='pl-8 h-8 text-xs'
          />
        </div>
      </FilterSection>

      <div className='h-px bg-border mx-1' />

      <FilterSection title='Status'>
        <div className='flex flex-wrap gap-1.5'>
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilter({
                  ...filter,
                  statusOption: opt.value,
                });
              }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filter.statusOption === opt.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <div className='h-px bg-border mx-1' />

      <FilterSection title='Price Range'>
        <div className='flex items-center gap-2'>
          <div className='relative flex-1'>
            <span className='absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none'>
              $
            </span>
            <Input
              type='number'
              placeholder='Min'
              value={filter.priceMin}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  priceMin: e.target.value,
                });
              }}
              className='pl-5 h-8 text-xs'
            />
          </div>
          <span className='text-xs text-muted-foreground shrink-0'>–</span>
          <div className='relative flex-1'>
            <span className='absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none'>
              $
            </span>
            <Input
              type='number'
              placeholder='Max'
              value={filter.priceMax}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  priceMax: e.target.value,
                });
              }}
              className='pl-5 h-8 text-xs'
            />
          </div>
        </div>
      </FilterSection>

      <div className='h-px bg-border mx-1' />

      <FilterSection title='Deadline'>
        <div className='space-y-0.5'>
          {deadlineOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFilter({
                  ...filter,
                  deadline: opt.value,
                });
              }}
              className={cn(
                'w-full text-left rounded-md px-2.5 py-1.5 text-xs transition-colors',
                filter.deadline === opt.value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <Button
        className='w-full py-5'
        disabled={!hasActiveFilters}
        onClick={() => {
          const params = new URLSearchParams();
          if (filter.query !== '') params.set('query', filter.query);
          if (filter.statusOption !== 'all')
            params.set('statusOption', filter.statusOption);
          if (filter.priceMin !== '') params.set('priceMin', filter.priceMin);
          if (filter.priceMax !== '') params.set('priceMax', filter.priceMax);
          if (filter.deadline !== 'any')
            params.set('deadline', filter.deadline);
          params.delete('failedFetch');

          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
}
