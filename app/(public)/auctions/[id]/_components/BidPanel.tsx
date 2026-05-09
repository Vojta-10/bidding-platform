'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BidForm } from './BidForm';
import { CountdownTimer } from './CountdownTimer';
import { CurrentPrice } from './CurrentPrice';
import { EndedBanner } from './EndedBanner';
import { SellerPanel } from './SellerPanel';
import { SignInPrompt } from './SignInPrompt';
import { User } from '@supabase/supabase-js';
import { Subtitle } from '@/components/ui/typography';
import { bidsType } from '@/lib/queries/auctions';

interface BidPanelProps {
  initialPrice: number;
  deadline: string;
  status: string;
  auction: {
    id: string;
    sellerId: string;
    winnerId: string | null;
    currentPrice: number;
    bid_count: number;
  };
  currentUser: User | null;
  initialBidCount: number;
  leader?: bidsType;
}

export function BidPanel({
  initialPrice,
  deadline,
  status,
  auction,
  currentUser,
  initialBidCount,
  leader,
}: BidPanelProps) {
  const router = useRouter();
  const isClosed = status === 'closed';
  const isSeller = !!currentUser && currentUser.id === auction.sellerId;
  const isLoggedIn = !!currentUser;
  const leaderUsername = leader?.profiles.username;
  const leaderId = leader?.bidder_id;
  const sellerId = auction.sellerId;
  const winnerId = auction.winnerId;
  return (
    <Card className='gap-0 py-0'>
      <CardContent className='flex flex-col gap-5 p-5'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <CurrentPrice price={initialPrice} />
            {leaderId === currentUser?.id ? (
              <Subtitle className='text-primary font-bold tracking-tight'>
                You are leading!
              </Subtitle>
            ) : (
              ''
            )}
          </div>

          {!isClosed && (
            <CountdownTimer deadline={deadline} onExpire={router.refresh} />
          )}
        </div>

        <Separator />

        {isClosed ? (
          <EndedBanner
            finalPrice={auction.currentPrice}
            winnerUsername={null}
          />
        ) : isSeller ? (
          <SellerPanel
            auctionId={auction.id}
            bidCount={initialBidCount}
            currentPrice={initialPrice}
            leaderUsername={leaderUsername ?? null}
          />
        ) : isLoggedIn ? (
          <BidForm
            auction={{ id: auction.id, sellerId, winnerId }}
            currentPrice={initialPrice}
            userId={currentUser.id}
          />
        ) : (
          <SignInPrompt auctionId={auction.id} />
        )}
      </CardContent>
    </Card>
  );
}
