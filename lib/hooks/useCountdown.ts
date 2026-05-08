'use client';

import { useEffect, useState } from 'react';
import { calcTimeLeft } from '@/lib/utils';

export function useCountdown(
  deadline: string,
  extend = false,
  onExpire?: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(deadline, extend));

  useEffect(() => {
    if (calcTimeLeft(deadline, extend).text === 'Ended') return;

    const id = setInterval(() => {
      const next = calcTimeLeft(deadline, extend);
      setTimeLeft(next);
      if (next.text === 'Ended') {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deadline, extend, onExpire]);

  return timeLeft;
}
