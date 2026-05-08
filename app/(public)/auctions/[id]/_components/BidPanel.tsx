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

interface BidPanelProps {
  initialPrice: number;
  deadline: string;
  status: 'active' | 'closed';
  auction: {
    id: string;
    seller_id: string;
    winner_id: string | null;
    current_price: number;
    bid_count: number;
  };
  currentUser: User | null;
  initialBidCount: number;
  leaderUsername?: string | null;
}

export function BidPanel({
  initialPrice,
  deadline,
  status,
  auction,
  currentUser,
  initialBidCount,
  leaderUsername,
}: BidPanelProps) {
  const router = useRouter();
  const isClosed = status === 'closed';
  const isSeller = !!currentUser && currentUser.id === auction.seller_id;
  const isLoggedIn = !!currentUser;

  return (
    <Card className='gap-0 py-0'>
      <CardContent className='flex flex-col gap-5 p-5'>
        <div className='flex flex-col gap-4'>
          <CurrentPrice price={initialPrice} />
          {!isClosed && (
            <CountdownTimer deadline={deadline} onExpire={router.refresh} />
          )}
        </div>

        <Separator />

        {isClosed ? (
          <EndedBanner finalPrice={auction.current_price} winnerUsername={null} />
        ) : isSeller ? (
          <SellerPanel
            auctionId={auction.id}
            bidCount={initialBidCount}
            currentPrice={initialPrice}
            leaderUsername={leaderUsername ?? null}
          />
        ) : isLoggedIn ? (
          <BidForm auctionId={auction.id} currentPrice={initialPrice} />
        ) : (
          <SignInPrompt auctionId={auction.id} />
        )}
      </CardContent>
    </Card>
  );
}
