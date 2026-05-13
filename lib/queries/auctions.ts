import { Auction } from '@/types/database';
import { createClient } from '../supabase/server';
import { notFound, redirect } from 'next/navigation';

export type bidsType = {
  id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles: {
    username?: string;
  };
};

export type MyListingsType = {
  id: string;
  title: string;
  current_price: number;
  deadline: string;
  status: string;
  bid_count: number;
};

export type dashboardBids = {
  auction_id: string;
  auctions: {
    current_price: number;
    deadline: string;
    image_url: string | null;
    title: string;
  };
};

export type activeBidsType = dashboardBids & {
  amount: number;
  auctions: {
    status: string;
  };
};

export type auctionType = Auction & {
  profiles: {
    username: string;
  };
};

export async function getAuction(
  auctionId: string,
): Promise<null | auctionType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('auctions')
    .select('*, profiles!seller_id (username)')
    .eq('id', auctionId)
    .single();

  if (error) notFound();

  return data;
}

export async function getBids(auctionId: string): Promise<null | bidsType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bids')
    .select('id, bidder_id, amount, created_at, profiles (username)')
    .eq('auction_id', auctionId)
    .order('created_at', { ascending: false });

  if (error) {
    redirect('/auctions?failed=true');
  }

  return data;
}

export async function getActiveBids(userId: string): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: activeBidsType[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bids')
    .select(
      'amount, auction_id, auctions!inner (title, image_url, current_price, deadline, status)',
    )
    .eq('bidder_id', userId)
    .eq('auctions.status', 'active')
    .order('created_at', { ascending: false });

  if (error) return { success: false, errorMessage: 'Something went wrong!' };
  const uniqueIds: Set<string> = new Set();
  const uniqueBids: Set<activeBidsType> = new Set();
  data.forEach((row) => {
    if (!uniqueIds.has(row.auction_id)) {
      uniqueBids.add(row);
      uniqueIds.add(row.auction_id);
    }
  });
  return { success: true, data: [...uniqueBids] };
}

export async function getWachlist(userId: string): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: dashboardBids[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('watchlist')
    .select(
      'auction_id, auctions!inner (title, image_url, current_price, deadline)',
    )
    .eq('user_id', userId);
  if (error) return { success: false, errorMessage: 'Something went wrong!' };
  return { success: true, data };
}

export async function getMyListings(userId: string): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: MyListingsType[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('auctions')
    .select('id, title, current_price, deadline, status, bid_count')
    .eq('seller_id', userId)
    .order('deadline', { ascending: true });
  if (error) return { success: false, errorMessage: 'Something went wrong!' };
  return { success: true, data };
}
