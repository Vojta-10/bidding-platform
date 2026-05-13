import ActiveBids from '@/app/dashboard/_components/ActiveBids/ActiveBids';
import StatsStrip from '@/app/dashboard/_components/StatsStrip';
import Watching from '@/app/dashboard/_components/TwoColGrid/Watching';
import RecentActivity from '@/app/dashboard/_components/TwoColGrid/RecentActivity';
import MyListingsCollapsible from '@/app/dashboard/_components/MyListings/MyListingsCollapsible';
import { createClient } from '@/lib/supabase/server';
import {
  getActiveBids,
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

  if (!activeBids || !watchlistAuctions || !myListings) {
    toasts.fetchError('Failed to get dashboard info!');
    return;
  }
  return (
    <div className='mx-16 my-10 flex flex-col justify-center'>
      <StatsStrip />
      <ActiveBids bids={activeBids} />
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
