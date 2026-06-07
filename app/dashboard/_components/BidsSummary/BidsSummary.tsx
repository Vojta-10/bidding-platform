import { Card } from '@/components/ui/card';
import { BidsSummaryContent } from './BidsSummaryContent';
import { activeBidsType } from '@/lib/queries/auctions';

export default function BidsSummary({ bids }: { bids: activeBidsType[] }) {
  return (
    <Card className='mt-12'>
      <BidsSummaryContent bids={bids} />
    </Card>
  );
}
