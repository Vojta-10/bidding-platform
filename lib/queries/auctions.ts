import { Auction } from '@/types/database';
import { createClient } from '../supabase/server';
import { notFound, redirect } from 'next/navigation';

export type bidsType = {
  id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  profiles: {
    username: string;
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
