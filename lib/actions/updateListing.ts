'use server';

import { createClient } from '../supabase/server';
import { listingEditSchema } from '../validations/auction';

export async function updateListing(
  listingId: string,
  title: string,
  description: string,
  imageUrl?: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to perform this action!' };

  const result = listingEditSchema.safeParse({ title, description });
  if (!result.success) return { error: result.error.issues[0].message };

  const { data: listing, error: fetchError } = await supabase
    .from('auctions')
    .select('seller_id, bid_count')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) return { error: 'Listing not found.' };
  if (listing.seller_id !== user.id) return { error: 'You do not own this listing.' };
  if (listing.bid_count > 0)
    return { error: 'Listing is locked once bids are placed.' };

  const updates: { title: string; description: string; image_url?: string } = {
    title,
    description,
  };
  if (imageUrl) updates.image_url = imageUrl;

  const { error: updateError } = await supabase
    .from('auctions')
    .update(updates)
    .eq('id', listingId);

  if (updateError) return { error: updateError.message };
  return { success: true };
}
