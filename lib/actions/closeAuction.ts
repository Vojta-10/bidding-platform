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

  const [{ data: data1, error: err }, { data: data2, error: err2 }] =
    await Promise.all([
      supabase
        .from('bids')
        .select('bidder_id')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('auctions')
        .select('seller_id, title')
        .eq('id', auctionId)
        .single(),
    ]);

  if (err || err2)
    return { success: false, errorMessage: 'Something went wrong!' };

  const { error } = await supabase
    .from('auctions')
    .update({ status: 'closed', winner_id: data1?.bidder_id })
    .eq('id', auctionId);

  const { error: err3 } = await supabase.from('notifications').insert({
    user_id: data2.seller_id,
    auction_id: auctionId,
    type: 'listing_ended',
    title: 'Your auction has ended',
    description: `Your listing for ${data2.title} has ended`,
    href: `/auctions/${auctionId}`,
    read: false,
  });

  if (data1) {
    const { error: err4 } = await supabase.from('notifications').insert({
      user_id: data1?.bidder_id,
      auction_id: auctionId,
      type: 'auction_won',
      title: 'Auction won!',
      description: `You won the bid on ${data2.title}`,
      href: `/auctions/${auctionId}`,
      read: false,
    });

    if (err4) return { success: false, errorMessage: 'Something went wrong!' };
  }

  if (error || err3)
    return { success: false, errorMessage: 'Something went wrong!' };
  return { success: true };
}
