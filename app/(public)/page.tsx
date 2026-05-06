import { Hero } from './_components/Hero';
import { StatsStrip } from './_components/StatsStrip';
import { FeaturedAuctions } from './_components/FeaturedAuctions';

export default function Home() {
  return (
    <div className='flex flex-col'>
      <Hero />
      <StatsStrip />
      <FeaturedAuctions />
    </div>
  );
}
