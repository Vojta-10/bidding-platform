import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AuctionImage } from './_components/AuctionImage';
import { AuctionMeta } from './_components/AuctionMeta';
import { BidHistory } from './_components/BidHistory';
import { BidPanel } from './_components/BidPanel';
import { createClient } from '@/lib/supabase/server';
export default async function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const now = new Date();
  const supabase = await createClient();

  // --- Mock data: replace with getAuction(id) + getBids(id) queries ---
  // currentUser variants to preview different BidPanel states:
  //   null                           → SignInPrompt
  //   { id: 'seller-1', ... }        → SellerPanel
  //   { id: 'other-user', ... }      → BidForm
  const auction = {
    id,
    title: 'Vintage Rolex Submariner 1968 — Original Box & Papers',
    description:
      'An exceptionally preserved example of the reference 1680 Submariner, featuring the original gilt dial with "SWISS" only printing. Accompanied by the original purchase receipt, hang tags, and extract of the archives. Case measures 40mm and has been kept unpolished, retaining all original chamfers and finishing. Service records available on request.',
    image_url: null as string | null,
    current_price: 4200,
    starting_price: 500,
    deadline: new Date(
      now.getTime() + 2 * 3600 * 1000 + 14 * 60 * 1000 + 33 * 1000,
    ).toISOString(),
    status: 'active' as 'active' | 'closed',
    seller_id: 'seller-1',
    winner_id: null as string | null,
    bid_count: 23,
    created_at: new Date(now.getTime() - 3 * 24 * 3600 * 1000).toISOString(),
    seller: {
      id: 'seller-1',
      username: 'vintagewatches',
      avatar_url: null as string | null,
    },
  };

  const bids = [
    {
      id: '1',
      amount: 4200,
      created_at: new Date(now.getTime() - 5 * 60000).toISOString(),
      bidder: { username: 'watchlover99' },
    },
    {
      id: '2',
      amount: 3900,
      created_at: new Date(now.getTime() - 18 * 60000).toISOString(),
      bidder: { username: 'collector_vlt' },
    },
    {
      id: '3',
      amount: 3400,
      created_at: new Date(now.getTime() - 42 * 60000).toISOString(),
      bidder: { username: 'rolex_hunter' },
    },
    {
      id: '4',
      amount: 2800,
      created_at: new Date(now.getTime() - 90 * 60000).toISOString(),
      bidder: { username: 'timepiece_fan' },
    },
    {
      id: '5',
      amount: 1500,
      created_at: new Date(now.getTime() - 150 * 60000).toISOString(),
      bidder: { username: 'vintagefan22' },
    },
    {
      id: '6',
      amount: 1500,
      created_at: new Date(now.getTime() - 150 * 60000).toISOString(),
      bidder: { username: 'vintagefan22' },
    },
    {
      id: '7',
      amount: 1500,
      created_at: new Date(now.getTime() - 150 * 60000).toISOString(),
      bidder: { username: 'vintagefan22' },
    },
  ];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const leaderUsername = bids[0]?.bidder.username ?? null;
  // ---

  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-6xl px-4 py-6 sm:px-6'>
        <div className='mb-6'>
          <Link
            href='/auctions'
            className={cn(
              buttonVariants({ variant: 'link', size: 'lg' }),
              '-ml-1 pl-0 text-muted-foreground hover:text-foreground',
            )}
          >
            <ArrowLeft /> Back to auctions
          </Link>
        </div>

        {/* Two-column layout */}
        <div className='grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]'>
          {/* Left: image + mobile bid panel + meta */}
          <div className='flex flex-col gap-6'>
            <AuctionImage imageUrl={auction.image_url} title={auction.title} />

            {/* Mobile only — BidPanel between image and description */}
            <div className='lg:hidden'>
              <BidPanel
                initialPrice={auction.current_price}
                deadline={auction.deadline}
                status={auction.status}
                auction={auction}
                currentUser={user}
                initialBidCount={auction.bid_count}
                leaderUsername={leaderUsername}
              />
            </div>

            <AuctionMeta
              title={auction.title}
              description={auction.description}
              seller={auction.seller}
              createdAt={auction.created_at}
            />
          </div>

          {/* Right: sticky BidPanel (desktop only) */}
          <div className='sticky top-6 hidden self-start lg:block'>
            <BidPanel
              initialPrice={auction.current_price}
              deadline={auction.deadline}
              status={auction.status}
              auction={auction}
              currentUser={user}
              initialBidCount={auction.bid_count}
              leaderUsername={leaderUsername}
            />
          </div>
        </div>

        {/* Full-width bid history */}
        <div className='mt-10'>
          <BidHistory auctionId={auction.id} initialBids={bids} />
        </div>
      </div>
    </div>
  );
}
