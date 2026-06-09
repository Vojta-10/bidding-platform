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

export type BrowseBids = {
  id: string;
  image_url: string | null;
  current_price: number;
  deadline: string;
  status: string;
  bid_count: number;
  title: string;
  description: string;
};

export type MyListingsType = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
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

export type historyBidsType = dashboardBids & {
  amount: number;
  won: boolean;
  auctions: {
    status: string;
  };
};

export type auctionType = Auction & {
  profiles: {
    username: string;
  };
};

export type filterType = {
  query: string;
  priceMin: string;
  priceMax: string;
  deadline: string;
};

export type sortType = {
  type: string;
  ascending: string;
};

export async function getAuctions(
  filter: filterType,
  sort: sortType,
): Promise<BrowseBids[]> {
  const supabase = await createClient();
  let query = supabase
    .from('auctions')
    .select(
      'id, image_url, current_price, deadline, status, bid_count, title, description',
    );
  if (filter.query !== '') {
    query = query.ilike('title', `%${filter.query}%`);
  }

  if (filter.priceMin !== '') {
    query = query.gte('current_price', Number(filter.priceMin));
  }

  if (filter.priceMax !== '') {
    query = query.lte('current_price', Number(filter.priceMax));
  }

  if (filter.deadline !== 'any') {
    if (filter.deadline === 'ended') {
      query = query.eq('status', 'closed');
    } else {
      let multiplicator;
      if (filter.deadline === 'today') {
        multiplicator = 24;
      } else {
        multiplicator = 7 * 24;
      }
      query = query
        .lte(
          'deadline',
          new Date(Date.now() + multiplicator * 3600000).toISOString(),
        )
        .eq('status', 'active');
    }
  } else {
    query = query.eq('status', 'active');
  }

  query = query.order(`${sort.type}`, {
    ascending: sort.ascending === 'true' ? true : false,
  });

  const { data, error } = await query;

  if (error) {
    console.log(error);
    redirect('/auctions?failedFetch=true');
  }

  return data;
}

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

export async function getHistoryBids(userId: string): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: historyBidsType[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bids')
    .select(
      'amount, auction_id, auctions!inner (title, image_url, current_price, deadline, status, winner_id)',
    )
    .eq('bidder_id', userId)
    .eq('auctions.status', 'closed')
    .order('created_at', { ascending: false });

  if (error) return { success: false, errorMessage: 'Something went wrong!' };

  const uniqueIds: Set<string> = new Set();
  const uniqueBids: historyBidsType[] = [];
  data.forEach((row) => {
    if (!uniqueIds.has(row.auction_id)) {
      // winner_id stays server-side; expose only the derived `won` boolean
      const { winner_id, ...auctions } = row.auctions;
      uniqueBids.push({
        auction_id: row.auction_id,
        amount: row.amount,
        won: winner_id === userId,
        auctions,
      });
      uniqueIds.add(row.auction_id);
    }
  });
  return { success: true, data: uniqueBids };
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
    .select('id, title, description, image_url, current_price, deadline, status, bid_count')
    .eq('seller_id', userId)
    .order('status')
    .order('deadline', { ascending: true });
  if (error) return { success: false, errorMessage: 'Something went wrong!' };
  return { success: true, data };
}

export type HomeStats = {
  liveAuctions: number;
  totalValueTraded: number;
  registeredMembers: number;
};

export async function getHomeStats(): Promise<HomeStats> {
  const supabase = await createClient();
  const [auctionsRes, membersRes, tradedRes] = await Promise.all([
    supabase.from('auctions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('auctions').select('current_price').eq('status', 'closed'),
  ]);
  return {
    liveAuctions: auctionsRes.count ?? 0,
    registeredMembers: membersRes.count ?? 0,
    totalValueTraded: tradedRes.data?.reduce((sum, a) => sum + a.current_price, 0) ?? 0,
  };
}

export async function getHotAuctions(): Promise<BrowseBids[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('auctions')
    .select('id, image_url, current_price, deadline, status, bid_count, title, description')
    .eq('status', 'active')
    .order('bid_count', { ascending: false })
    .limit(3);
  return data ?? [];
}

export async function getAuctionsWon(userId: string): Promise<{
  success: boolean;
  errorMessage?: string;
  data?: {
    wonAuctions: number;
    recentlyWonAuctions: number;
    totalSpent: number;
    thisMonth: number;
  };
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('auctions')
    .select('deadline, current_price')
    .eq('winner_id', userId)
    .eq('status', 'closed');

  if (error) return { success: false, errorMessage: 'Something went wrong!' };

  const today = new Date();
  const wonAuctions: number = data.length;
  const recentlyWonAuctions = data.reduce(
    (acc, row: { deadline: string; current_price: number }) => {
      const auctionDate = new Date(row.deadline);
      if (
        today.getUTCMonth() === auctionDate.getUTCMonth() &&
        today.getUTCFullYear() === auctionDate.getUTCFullYear()
      ) {
        acc++;
      }
      return acc;
    },
    0,
  );
  const { totalSpent, thisMonth } = data.reduce(
    (
      { totalSpent, thisMonth },
      row: { deadline: string; current_price: number },
    ) => {
      totalSpent += row.current_price;
      const auctionDate = new Date(row.deadline);

      if (
        today.getUTCMonth() === auctionDate.getUTCMonth() &&
        today.getUTCFullYear() === auctionDate.getUTCFullYear()
      ) {
        thisMonth += row.current_price;
      }
      return { totalSpent, thisMonth };
    },
    { totalSpent: 0, thisMonth: 0 },
  );

  return {
    success: true,
    data: { wonAuctions, recentlyWonAuctions, totalSpent, thisMonth },
  };
}
