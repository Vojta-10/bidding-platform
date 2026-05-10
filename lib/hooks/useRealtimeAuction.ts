import { useEffect, useState } from 'react';
import { createClient } from '../supabase/client';
import { Auction } from '@/types/database';

export function useRealtimeAuction(
  auctionId: string,
  initialPrice: number,
): number {
  const [newAmount, setNewAmount] = useState<number>(initialPrice);
  const supabase = createClient();

  useEffect(() => {
    const changes = supabase
      .channel(`bid-amount-changes-${auctionId}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${auctionId}`,
        },
        async (payload) => {
          setNewAmount((payload.new as Auction).current_price);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(changes);
    };
  }, [supabase, auctionId]);
  return newAmount;
}
