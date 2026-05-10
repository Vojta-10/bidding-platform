import { createClient } from '../supabase/client';
import { useEffect, useState } from 'react';
import { bidsType } from '../queries/auctions';

export function useRealtimeBids(
  initialBids: bidsType[],
  auctionId: string,
): bidsType[] {
  const [newBids, setNewBids] = useState<bidsType[]>(initialBids);
  const supabase = createClient();

  useEffect(() => {
    const changes = supabase
      .channel(`bids-changes-${auctionId}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', (payload.new as bidsType).bidder_id)
            .single();
          if (error || !data) return;
          const newBid = {
            ...(payload.new as bidsType),
            profiles: {
              username: data?.username,
            },
          };
          setNewBids((prev) => [newBid, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(changes);
    };
  }, [auctionId, supabase]);
  return newBids;
}
