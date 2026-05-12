'use server';

import { createClient } from '../supabase/server';

export async function addToWatchlist(
  auctionId: string,
): Promise<{ success: boolean; errorMessage?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, errorMessage: 'Authentication failed!' };

  const { error } = await supabase.from('watchlist').insert({
    user_id: user.id,
    auction_id: auctionId,
  });

  return error
    ? { success: false, errorMessage: 'Something went wrong!' }
    : { success: true };
}

export async function removeFromWatchlist(
  auctionId: string,
): Promise<{ success: boolean; errorMessage?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, errorMessage: 'Authentication failed!' };

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('auction_id', auctionId)
    .eq('user_id', user.id);

  return error
    ? { success: false, errorMessage: 'Something went wrong!' }
    : { success: true };
}
