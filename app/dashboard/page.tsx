import ActiveBids from '@/app/dashboard/_components/ActiveBids/ActiveBids';
import StatsStrip from '@/app/dashboard/_components/StatsStrip';
import Watching from '@/app/dashboard/_components/TwoColGrid/Watching';
import RecentActivity from '@/app/dashboard/_components/TwoColGrid/RecentActivity';
import MyListingsCollapsible from '@/app/dashboard/_components/MyListings/MyListingsCollapsible';

export default function DashboardPage() {
  return (
    <div className='mx-16 my-10 flex flex-col justify-center'>
      <StatsStrip />
      <ActiveBids />
      <div className='mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Watching />
        </div>
        <div className='lg:col-span-1'>
          <RecentActivity />
        </div>
      </div>
      <div className='mt-16'>
        <MyListingsCollapsible />
      </div>
    </div>
  );
}
