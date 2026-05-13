'use server';

import { Json } from '@/types/database';
import { createClient } from '../supabase/server';

type placeBidType = {
  bidderId: string;
  bidAmount: number;
  auction: {
    id: string;
    sellerId: string;
    winnerId: string | null;
  };
};

export async function placeBid({
  bidderId,
  bidAmount,
  auction,
}: placeBidType): Promise<
  { error: string } | { success: boolean; data: Json }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Authentication failed' };

  if (user.id !== bidderId)
    return { success: false, error: 'There was an error placing bid' };

  if (auction.sellerId === user.id)
    return {
      success: false,
      error: 'You own the auction you can not place bid on it',
    };

  const { data: currentLeader } = await supabase
    .from('bids')
    .select('bidder_id')
    .eq('auction_id', auction.id)
    .limit(1)
    .single();

  console.log(currentLeader, 'ahoj');

  if (currentLeader?.bidder_id === user.id)
    return { error: 'You are already leading this auction' };
  const p_auction_id = auction.id;
  const p_bidder_id = user.id;
  const p_amount = bidAmount;

  const { data, error } = await supabase.rpc('place_bid', {
    p_auction_id,
    p_bidder_id,
    p_amount,
  });

  if (error)
    return { success: false, error: 'There was an error placing your bid' };
  return { success: true, data };
}
