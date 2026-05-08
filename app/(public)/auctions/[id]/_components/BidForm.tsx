'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Gavel } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBidSchema, type BidFormValues } from '@/lib/validations/bids';
import { useForm } from 'react-hook-form';

interface BidFormProps {
  auctionId: string;
  currentPrice: number;
}

export function BidForm({ auctionId, currentPrice }: BidFormProps) {
  const minBid = currentPrice + 1;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BidFormValues>({
    resolver: zodResolver(createBidSchema(currentPrice)),
    defaultValues: { amount: minBid },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_data: BidFormValues) {
    void auctionId;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='bid-amount' className='text-sm font-medium'>
          Your bid
        </label>
        <div className='relative'>
          <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground'>
            $
          </span>
          <Input
            id='bid-amount'
            type='number'
            min={minBid}
            step={1}
            placeholder={minBid.toString()}
            className='pl-6'
            aria-invalid={!!errors.amount}
            {...register('amount', { valueAsNumber: true })}
          />
        </div>
        {errors.amount ? (
          <p className='text-xs text-destructive'>{errors.amount.message}</p>
        ) : (
          <p className='text-xs text-muted-foreground'>
            Minimum: {formatCurrency(minBid)}
          </p>
        )}
      </div>
      <Button size='lg' className='w-full gap-2' type='submit' disabled={isSubmitting}>
        <Gavel className='size-4' />
        {isSubmitting ? 'Placing bid…' : 'Place Bid'}
      </Button>
    </form>
  );
}
