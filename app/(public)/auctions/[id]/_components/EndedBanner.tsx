import { formatCurrency } from '@/lib/utils';
import { Gavel, Trophy } from 'lucide-react';

interface EndedBannerProps {
  finalPrice: number;
  winnerUsername: string | null;
}

export function EndedBanner({ finalPrice, winnerUsername }: EndedBannerProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2 rounded-lg bg-muted px-4 py-3'>
        <Gavel className='size-4 shrink-0 text-muted-foreground' />
        <span className='text-sm font-medium'>This auction has ended</span>
      </div>

      <div className='flex flex-col gap-0.5'>
        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
          Final price
        </p>
        <p className='font-heading text-2xl font-bold text-primary tabular-nums'>
          {formatCurrency(finalPrice)}
        </p>
      </div>

      {winnerUsername ? (
        <div className='flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3'>
          <Trophy className='size-4 shrink-0 text-primary' />
          <span className='text-sm'>
            Won by{' '}
            <span className='font-semibold text-primary'>@{winnerUsername}</span>
          </span>
        </div>
      ) : (
        <div className='flex items-center gap-2 rounded-lg bg-muted px-4 py-3'>
          <span className='text-sm text-muted-foreground'>No bids were placed</span>
        </div>
      )}
    </div>
  );
}
