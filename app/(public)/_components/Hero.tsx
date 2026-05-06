import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BackgroundOrbs } from './BackgroundOrbs';

export function Hero() {
  return (
    <section className='relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-5 py-24 text-center overflow-hidden'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        <BackgroundOrbs />
        <div className='absolute bottom-0 inset-x-0 h-40 bg-linear-to-b from-transparent to-background' />
      </div>
      <h1 className='font-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.15] max-w-2xl'>
        Where Great Things Find Their Value.
      </h1>
      <p className='mt-5 text-lg text-muted-foreground max-w-[42ch]'>
        Discover rare items, compete in live auctions, and win at the price
        you set.
      </p>
      <div className='mt-10 flex flex-col sm:flex-row items-center gap-5'>
        <Link href='/auctions' className={cn(buttonVariants({ size: 'lg' }))}>
          Browse Live Auctions
        </Link>
        <Link
          href='/auctions/new'
          className='text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5'
        >
          Start Selling <ArrowRight className='size-4' />
        </Link>
      </div>
    </section>
  );
}
