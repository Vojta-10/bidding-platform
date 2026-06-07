import BidsSummary from '@/app/dashboard/_components/BidsSummary/BidsSummary';
import StatsStrip from '@/app/dashboard/_components/StatsStrip';
import Watching from '@/app/dashboard/_components/TwoColGrid/Watching';
import RecentActivity from '@/app/dashboard/_components/TwoColGrid/RecentActivity';
import MyListingsCollapsible from '@/app/dashboard/_components/MyListings/MyListingsCollapsible';
import { createClient } from '@/lib/supabase/server';
import {
  getActiveBids,
  getAuctionsWon,
  getMyListings,
  getWachlist,
} from '@/lib/queries/auctions';
import { toasts } from '@/components/shared/toast';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: activeBids } = await getActiveBids(user.id);
  const { data: watchlistAuctions } = await getWachlist(user.id);
  const { data: myListings } = await getMyListings(user.id);
  const { data: statsStripData } = await getAuctionsWon(user.id);
  if (!activeBids || !watchlistAuctions || !myListings || !statsStripData) {
    toasts.fetchError('Failed to get dashboard info!');
    return;
  }
  const { wonAuctions, recentlyWonAuctions, totalSpent, thisMonth } =
    statsStripData;

  return (
    <div className='mx-16 my-10 flex flex-col justify-center'>
      <StatsStrip
        wonAuctions={wonAuctions}
        recentlyWonAuctions={recentlyWonAuctions}
        totalSpent={totalSpent}
        thisMonth={thisMonth}
        activeBids={activeBids.length}
        endingToday={
          activeBids.filter((bid) => {
            const today = new Date();
            return (
              new Date(bid.auctions.deadline).getUTCDate() ===
              today.getUTCDate()
            );
          }).length
        }
        myListings={myListings}
      />
      <BidsSummary bids={activeBids.slice(0, 5)} />
      <div className='mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Watching watchlistAuctions={watchlistAuctions} />
        </div>
        <div className='lg:col-span-1'>
          <RecentActivity />
        </div>
      </div>
      <div className='mt-16'>
        <MyListingsCollapsible myListings={myListings} />
      </div>
    </div>
  );
}
