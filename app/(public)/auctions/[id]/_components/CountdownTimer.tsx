'use client';

import { useCountdown } from '@/lib/hooks/useCountdown';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  deadline: string;
  onExpire?: () => void;
}

export function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
  const timeLeft = useCountdown(deadline, true, onExpire);

  return (
    <div className='flex flex-col gap-0.5'>
      <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
        Time remaining
      </p>
      <div className='flex items-center gap-1.5'>
        <Clock
          className={cn(
            'size-4 shrink-0',
            timeLeft.urgent ? 'text-destructive' : 'text-muted-foreground',
          )}
        />
        <span
          suppressHydrationWarning
          className={cn(
            'font-mono text-xl font-bold tabular-nums leading-none',
            timeLeft.urgent
              ? 'animate-pulse text-destructive'
              : 'text-foreground',
          )}
        >
          {timeLeft.text}
        </span>
      </div>
    </div>
  );
}
