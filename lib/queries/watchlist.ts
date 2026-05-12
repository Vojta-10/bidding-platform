import { createClient } from '../supabase/server';

export async function checkWatched(
  auctionId: string,
): Promise<{ isWatched?: boolean; success: boolean; errorMessage?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, errorMessage: 'Authentication failed!' };

  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('auction_id', auctionId)
    .eq('user_id', user.id);

  if (error) return { success: false, errorMessage: 'Something went wrong!' };

  return { isWatched: data.length !== 0, success: true };
}
