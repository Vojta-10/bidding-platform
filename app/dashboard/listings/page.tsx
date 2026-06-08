import { createClient } from '@/lib/supabase/server';
import { getMyListings } from '@/lib/queries/auctions';
import { toasts } from '@/components/shared/toast';
import { ListingsPageContent } from './_components/ListingsPageContent';

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: listings } = await getMyListings(user.id);

  if (!listings) {
    toasts.fetchError('your listings');
    return;
  }

  return (
    <div className='mx-16 my-10'>
      <ListingsPageContent listings={listings} />
    </div>
  );
}
