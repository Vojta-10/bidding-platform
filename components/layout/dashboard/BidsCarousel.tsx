'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BidCard, type BidCardData } from './BidCard';

const SCROLL_STEP = 272; // w-64 (256) + gap-4 (16)

export function BidsCarousel({ bids }: { bids: BidCardData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [progress, setProgress] = useState(0);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);
    setProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bids, sync]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'right' ? SCROLL_STEP : -SCROLL_STEP,
      behavior: 'smooth',
    });
  };

  const showProgress = canScrollLeft || canScrollRight;

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative'>
        {/* Edge fades */}
        <div
          className={cn(
            'pointer-events-none absolute left-0 top-0 z-10 h-full w-8 sm:w-16 bg-linear-to-r from-card to-transparent transition-opacity duration-200',
            canScrollLeft ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute right-0 top-0 z-10 h-full w-8 sm:w-16 bg-linear-to-l from-card to-transparent transition-opacity duration-200',
            canScrollRight ? 'opacity-100' : 'opacity-0',
          )}
        />

        {/* Nav arrows */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label='Scroll left'
          className={cn(
            'absolute left-2 top-1/2 z-20 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border transition-all duration-200 hover:bg-muted',
            canScrollLeft
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
        >
          <ChevronLeft className='size-4' />
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label='Scroll right'
          className={cn(
            'absolute right-2 top-1/2 z-20 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border transition-all duration-200 hover:bg-muted',
            canScrollRight
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
        >
          <ChevronRight className='size-4' />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={sync}
          className='flex gap-4 pb-2 px-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
          {bids.map((bid) => (
            <BidCard key={bid.id} bid={bid} />
          ))}
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        className={cn(
          'h-px w-full rounded-full bg-border transition-opacity duration-300',
          showProgress ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div
          className='h-full rounded-full bg-primary transition-all duration-150'
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
