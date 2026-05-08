import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowRight, Crown, TrendingUp, Users } from 'lucide-react';

interface SellerPanelProps {
  auctionId: string;
  bidCount: number;
  currentPrice: number;
  leaderUsername: string | null;
}

export function SellerPanel({ auctionId, bidCount, currentPrice, leaderUsername }: SellerPanelProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1 rounded-lg bg-muted p-3'>
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <Users className='size-3.5' />
            <span className='text-xs'>Total bids</span>
          </div>
          <p className='text-xl font-bold tabular-nums'>{bidCount}</p>
        </div>
        <div className='flex flex-col gap-1 rounded-lg bg-muted p-3'>
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <TrendingUp className='size-3.5' />
            <span className='text-xs'>Current price</span>
          </div>
          <p className='text-xl font-bold text-primary tabular-nums'>{formatCurrency(currentPrice)}</p>
        </div>
      </div>

      {leaderUsername && (
        <div className='flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2.5'>
          <Crown className='size-3.5 shrink-0 text-primary' />
          <span className='text-sm'>
            Leading:{' '}
            <span className='font-semibold text-primary'>@{leaderUsername}</span>
          </span>
        </div>
      )}

      <Link
        href={`/dashboard?highlight=${auctionId}`}
        className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-between')}
      >
        Manage in Dashboard
        <ArrowRight className='size-4' />
      </Link>
    </div>
  );
}
