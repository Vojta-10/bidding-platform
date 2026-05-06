import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowRight, Clock, ImageIcon } from 'lucide-react';
import Link from 'next/link';

const featuredAuctions = [
  { title: 'Vintage Rolex Submariner 1968', price: 4200, timeLeft: '2h 14m', urgent: false },
  { title: 'Mid-Century Eames Lounge Chair', price: 1850, timeLeft: '5h 40m', urgent: false },
  { title: 'First Edition Hemingway', price: 320, timeLeft: '23m', urgent: true },
  { title: 'Leica M6 35mm Film Camera', price: 2100, timeLeft: '1d 3h', urgent: false },
];

export function FeaturedAuctions() {
  return (
    <section className='py-24 px-5'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-baseline justify-between mb-10'>
          <h2 className='font-heading text-2xl font-semibold tracking-tight'>
            Live Right Now
          </h2>
          <Link
            href='/auctions'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1'
          >
            View All Auctions <ArrowRight className='size-3.5' />
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {featuredAuctions.map((auction, i) => (
            <Card
              key={auction.title}
              className={cn(
                'gap-0 py-0 overflow-hidden rounded-xl transition-all hover:shadow-md',
                i === 3 && 'md:hidden',
                auction.urgent && 'ring-1 ring-destructive/40',
              )}
            >
              <div className='aspect-video bg-muted flex items-center justify-center'>
                <ImageIcon className='size-10 text-muted-foreground/25' />
              </div>
              <CardContent className='p-4 flex flex-col gap-3'>
                <p className='font-medium line-clamp-2 leading-snug text-sm'>
                  {auction.title}
                </p>
                <div className='flex items-end justify-between'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Current bid</p>
                    <p className='text-base font-bold text-primary tabular-nums'>
                      {formatCurrency(auction.price)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                      auction.urgent
                        ? 'bg-destructive/10 text-destructive animate-pulse'
                        : 'bg-primary/10 text-primary',
                    )}
                  >
                    <Clock className='size-3' />
                    {auction.timeLeft}
                  </span>
                </div>
                <Link
                  href='/auctions'
                  className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                >
                  Place Bid
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
