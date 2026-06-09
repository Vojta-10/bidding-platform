'use server';

import { createClient } from '../supabase/server';

export async function markReadDB({
  userId,
  id,
}: {
  userId: string;
  id?: string;
}): Promise<{ success: boolean; errorMessage?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId)
    return { success: false, errorMessage: 'Authentication failed!' };

  let error;
  if (id) {
    error = await supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq('id', id);
  } else {
    error = await supabase
      .from('notifications')
      .update({
        read: true,
      })
      .eq('user_id', userId);
  }
  if (error.error)
    return { success: false, errorMessage: 'Something went wrong!' };

  return { success: true };
}
