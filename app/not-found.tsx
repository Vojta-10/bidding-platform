import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gavel } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center'>
      <div className='flex flex-col items-center gap-6 max-w-md'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <Gavel className='size-8 text-primary' />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='font-heading text-8xl font-bold text-primary/20 leading-none tabular-nums'>
            404
          </p>
          <h1 className='font-heading text-2xl font-semibold tracking-tight'>
            Lot Not Found
          </h1>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            This page has been withdrawn from auction or never existed.
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Link href='/auctions' className={cn(buttonVariants())}>
            Browse Auctions
          </Link>
          <Link href='/' className={cn(buttonVariants({ variant: 'outline' }))}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
