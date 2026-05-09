import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AuctionImage } from './_components/AuctionImage';
import { AuctionMeta } from './_components/AuctionMeta';
import { BidHistory } from './_components/BidHistory';
import { BidPanel } from './_components/BidPanel';
import { createClient } from '@/lib/supabase/server';
import { getAuction, getBids } from '@/lib/queries/auctions';
import { notFound, redirect } from 'next/navigation';
export default async function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const auction = await getAuction(id);
  if (!auction) notFound();
  const bids = await getBids(id);
  if (!bids) redirect('/auctions?failed=true');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const leader = bids?.[0] ?? null;
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
                leader={leader}
              />
            </div>

            <AuctionMeta
              title={auction.title}
              description={auction.description}
              seller={auction.profiles}
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
              leader={leader}
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
