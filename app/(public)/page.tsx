import { FeaturedAuctions } from './_components/FeaturedAuctions';
import { Hero } from './_components/Hero';
import { HowItWorks } from './_components/HowItWorks';
import { StatsStrip } from './_components/StatsStrip';

export default function Home() {
  return (
    <div className='flex flex-col'>
      <Hero />
      <div className='w-4/5 mx-auto'>
      <StatsStrip />
      </div>
      <FeaturedAuctions />
      <HowItWorks />
    </div>
  );
}
