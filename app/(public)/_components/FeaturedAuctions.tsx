import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrowseBids } from '@/lib/queries/auctions';
import { cn, calcTimeLeft, formatCurrency } from '@/lib/utils';
import { ArrowRight, Clock, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function FeaturedAuctions({ auctions }: { auctions: BrowseBids[] }) {
  return (
    <section className='py-24'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6'>
        <div className='flex items-baseline justify-between mb-10'>
          <h2 className='font-heading text-3xl font-semibold tracking-tight'>
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
          {auctions.map((auction) => {
            const timeLeft = calcTimeLeft(auction.deadline);
            return (
              <Card
                key={auction.id}
                className={cn(
                  'gap-0 py-0 overflow-hidden rounded-xl transition-all hover:shadow-md',
                  timeLeft.urgent && 'ring-1 ring-destructive/40',
                )}
              >
                <div className='relative aspect-video bg-muted flex items-center justify-center overflow-hidden'>
                  {auction.image_url ? (
                    <Image
                      src={auction.image_url}
                      alt={auction.title}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 33vw'
                    />
                  ) : (
                    <ImageIcon className='size-10 text-muted-foreground/25' />
                  )}
                </div>
                <CardContent className='p-4 flex flex-col gap-3'>
                  <p className='font-medium line-clamp-2 leading-snug text-sm'>
                    {auction.title}
                  </p>
                  <div className='flex items-end justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground'>Current bid</p>
                      <p className='text-base font-bold text-primary tabular-nums'>
                        {formatCurrency(auction.current_price)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                        timeLeft.urgent
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary',
                      )}
                    >
                      <Clock className='size-3' />
                      {timeLeft.text}
                    </span>
                  </div>
                  <Link
                    href={`/auctions/${auction.id}`}
                    className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                  >
                    Place Bid
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
