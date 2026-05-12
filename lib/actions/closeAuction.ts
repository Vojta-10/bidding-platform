'use server';

import { createClient } from '../supabase/server';

export async function closeAuction(): Promise<{ error: string } | undefined> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('close_expired_auctions');

  if (error) return { error: 'Something went wrong!' };
}
