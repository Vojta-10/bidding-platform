'use server';

import { createClient as createC } from '@supabase/supabase-js';

export async function closeSpecificAuction(
  auctionId: string,
): Promise<{ success: boolean; errorMessage?: string }> {
  const supabase = createC(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { data, error: err } = await supabase
    .from('bids')
    .select('bidder_id')
    .eq('auction_id', auctionId)
    .order('amount', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (err) return { success: false, errorMessage: 'Something went wrong!' };

  const { error } = await supabase
    .from('auctions')
    .update({ status: 'closed', winner_id: data?.bidder_id })
    .eq('id', auctionId);

  if (error) return { success: false, errorMessage: 'Something went wrong!' };
  return { success: true };
}
