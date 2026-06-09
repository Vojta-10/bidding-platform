import { getHomeStats, getHotAuctions } from '@/lib/queries/auctions';
import { FeaturedAuctions } from './_components/FeaturedAuctions';
import { Hero } from './_components/Hero';
import { HowItWorks } from './_components/HowItWorks';
import { StatsStrip } from './_components/StatsStrip';

export default async function Home() {
  const [stats, hotAuctions] = await Promise.all([
    getHomeStats(),
    getHotAuctions(),
  ]);

  return (
    <div className='flex flex-col'>
      <Hero />
      <div className='w-4/5 mx-auto'>
        <StatsStrip stats={stats} />
      </div>
      <FeaturedAuctions auctions={hotAuctions} />
      <HowItWorks />
    </div>
  );
}
