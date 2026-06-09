import { createClient } from '../supabase/server';

export type NotificationType =
  | 'auction_outbid'
  | 'auction_won'
  | 'listing_new_bid'
  | 'listing_ended';

export type notificationsType = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  href: string;
  read: boolean;
  created_at: string;
};

export async function getNotifications(): Promise<{
  success: boolean;
  data?: notificationsType[];
  errorMessage?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, errorMessage: 'Authentication failed!' };

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, description, href, read, created_at')
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) return { success: false, errorMessage: 'Something went wrong!' };

  return { success: true, data: data as notificationsType[] };
}
