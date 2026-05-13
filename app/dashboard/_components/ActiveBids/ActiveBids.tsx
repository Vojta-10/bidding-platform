import { Card } from '@/components/ui/card';
import { ActiveBidsContent } from './ActiveBidsContent';
import { activeBidsType } from '../../../../lib/queries/auctions';
interface ActiveBidsProps {
  bids: activeBidsType[];
}

export default function ActiveBids({ bids }: ActiveBidsProps) {
  return (
    <Card className='mt-12'>
      <ActiveBidsContent bids={bids} />
    </Card>
  );
}
