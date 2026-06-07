'use server';

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
}: placeBidType): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Authentication failed' };

  if (user.id !== bidderId)
    return { error: 'There was an error placing bid' };

  if (auction.sellerId === user.id)
    return { error: 'You own the auction you can not place bid on it' };

  // All authoritative validation (status, deadline, amount, self-outbid)
  // lives in the place_bid RPC, which serializes concurrent bids via
  // SELECT ... FOR UPDATE. Don't pre-check the leader here: a plain
  // limit(1) without an order() returns an arbitrary bid, not the leader,
  // and any client-side check is racy anyway.
  const { data, error } = await supabase.rpc('place_bid', {
    p_auction_id: auction.id,
    p_bidder_id: user.id,
    p_amount: bidAmount,
  });

  if (error) return { error: 'There was an error placing your bid' };

  // The RPC reports business-rule failures in its JSON payload, not as a
  // Postgres error — surface those instead of treating them as success.
  const result = data as { success: boolean; error?: string } | null;
  if (!result?.success)
    return { error: result?.error ?? 'There was an error placing your bid' };

  return { success: true };
}
