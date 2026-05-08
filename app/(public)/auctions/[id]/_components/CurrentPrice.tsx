import { formatCurrency } from '@/lib/utils';

interface CurrentPriceProps {
  price: number;
}

export function CurrentPrice({ price }: CurrentPriceProps) {
  return (
    <div className='flex flex-col gap-0.5'>
      <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
        Current bid
      </p>
      <p className='font-heading text-3xl font-bold text-primary tabular-nums leading-none'>
        {formatCurrency(price)}
      </p>
    </div>
  );
}
