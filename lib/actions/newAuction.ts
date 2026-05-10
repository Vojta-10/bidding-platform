'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';
import { newAuctionSchema } from '../validations/auction';

export async function newAuction(
  title: string,
  description: string,
  startingPrice: number,
  deadline: string,
  imageUrl?: string,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to perform this action!' };

  const result = newAuctionSchema.safeParse({
    title,
    description,
    startingPrice,
    deadline,
  });

  if (!result.success) return { error: result.error.message };

  const { data, error } = await supabase
    .from('auctions')
    .insert({
      seller_id: user.id,
      title,
      description,
      starting_price: startingPrice,
      current_price: startingPrice,
      deadline: result.data.deadline,
      image_url: imageUrl,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  redirect(`/auctions/${data.id}`);
}
