import ActiveBids from '@/components/layout/dashboard/ActiveBids';
import StatsStrip from '@/components/layout/dashboard/StatsStrip';
import { Lead } from '@/components/ui/typography';

export default function DashboardPage() {
  return (
    <div className='flex flex-col w-9/10 justify-center mx-auto mt-16'>
      <div className='mx-auto w-full'>
        <StatsStrip></StatsStrip>
      </div>
      <Lead className='mt-12 text-3xl font-bold'>Active Bids</Lead>
      <ActiveBids></ActiveBids>
    </div>
  );
}
