'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Gavel, Trophy, Tag, Hourglass } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { notificationsType } from '@/lib/queries/notifications';
import { markReadDB } from '@/lib/actions/notifications';
import { createClient } from '@/lib/supabase/client';

const notificationConfig = {
  auction_outbid: {
    dot: 'bg-destructive',
    Icon: Gavel,
    iconClass: 'text-destructive',
  },
  auction_won: {
    dot: 'bg-green-500',
    Icon: Trophy,
    iconClass: 'text-green-600',
  },
  listing_new_bid: { dot: 'bg-primary', Icon: Tag, iconClass: 'text-primary' },
  listing_ended: {
    dot: 'bg-blue-500',
    Icon: Hourglass,
    iconClass: 'text-blue-600',
  },
};

export function NotificationPanel({
  initialNotifications,
  userId,
}: {
  initialNotifications: notificationsType[];
  userId: string;
}) {
  const supabase = createClient();
  const [notifications, setNotifications] =
    useState<notificationsType[]>(initialNotifications);

  const unreadCount = notifications.length;

  useEffect(() => {
    const channel = supabase
      .channel(`notifications-${userId}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as notificationsType, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function markAllRead() {
    setNotifications([]);
    const { success, errorMessage } = await markReadDB({ userId });
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const { success, errorMessage } = await markReadDB({ userId, id });
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label='Notifications'
        className='relative flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none data-popup-open:bg-muted data-popup-open:text-foreground'
      >
        <Bell className='size-4' />
        {unreadCount > 0 && (
          <span className='absolute top-1 right-1 size-1.5 rounded-full bg-primary' />
        )}
      </PopoverTrigger>

      <PopoverContent align='end' sideOffset={8} className='w-80 p-0 gap-0'>
        <div className='flex items-center justify-between px-4 py-3 border-b'>
          <span className='text-sm font-semibold'>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className='text-xs text-muted-foreground hover:text-foreground transition-colors'
            >
              Mark all read
            </button>
          )}
        </div>

        <div className='max-h-80 overflow-y-auto'>
          {notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-muted-foreground'>
              <Bell className='size-8 mb-2 opacity-30' />
              <p className='text-sm'>No notifications</p>
            </div>
          ) : (
            notifications.map((n) => {
              const { dot, Icon, iconClass } = notificationConfig[n.type];
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0',
                    !n.read && 'bg-muted/40',
                  )}
                >
                  <div className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full'>
                    <Icon className={cn('size-3.5', iconClass)} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between gap-2'>
                      <p className={cn('text-sm', !n.read && 'font-medium')}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span
                          className={cn(
                            'mt-1.5 size-1.5 shrink-0 rounded-full',
                            dot,
                          )}
                        />
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground mt-0.5 line-clamp-2'>
                      {n.description}
                    </p>
                    <p className='text-xs text-muted-foreground/70 mt-1'>
                      {n.created_at}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
