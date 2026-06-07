import { createClient } from '@/lib/supabase/server';
import { getActiveBids, getHistoryBids } from '@/lib/queries/auctions';
import { toasts } from '@/components/shared/toast';
import BidsPageContent from './_components/BidsPageContent';

export default async function BidsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const [activeBids, historyBids] = await Promise.all([
    getActiveBids(user.id),
    getHistoryBids(user.id),
  ]);

  if (!activeBids.data || !historyBids.data) {
    toasts.fetchError('Failed to get your bids!');
    return;
  }

  return (
    <div className='mx-16 my-10'>
      <BidsPageContent
        activeBids={activeBids.data}
        historyBids={historyBids.data}
      />
    </div>
  );
}
