'use client';

import { useEffect, useRef, useState } from 'react';
import { calcTimeLeft } from '@/lib/utils';

export function useCountdown(
  deadline: string,
  extend = false,
  onExpire?: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(() =>
    calcTimeLeft(deadline, extend),
  );
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (calcTimeLeft(deadline, extend).text === 'Ended') {
      if (onExpireRef.current) {
        onExpireRef.current();
      }
      return;
    }

    const id = setInterval(() => {
      const next = calcTimeLeft(deadline, extend);
      setTimeLeft(next);
      if (next.text === 'Ended') {
        if (onExpireRef.current) {
          onExpireRef.current();
        }
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [deadline, extend]);

  return timeLeft;
}
