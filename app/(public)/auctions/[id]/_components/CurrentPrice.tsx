'use client';

import { formatCurrency } from '@/lib/utils';
import { Siren } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CurrentPriceProps {
  price: number;
}

export function CurrentPrice({ price }: CurrentPriceProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const highlight = () => {
      setIsHighlighted(true);
      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    };
    highlight();
  }, [price]);

  return (
    <div className='flex flex-col gap-0.5'>
      <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
        Current bid
      </p>
      <div
        className={`flex gap-2 items-center ${isHighlighted ? ' scale-105 transition-all duration-500 ease-in-out' : ''}`}
      >
        <p
          className={`font-heading text-3xl font-bold text-primary tabular-nums leading-none`}
        >
          {formatCurrency(price)}
        </p>
        {isHighlighted ? <Siren className='text-primary' /> : ''}
      </div>
    </div>
  );
}
