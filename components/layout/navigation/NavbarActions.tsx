'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotificationPanel } from './NotificationPanel';
import { UserMenu } from './UserMenu';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

interface NavbarActionsProps {
  user: User | null;
  profile: Profile | null;
}

export function NavbarActions({ user, profile }: NavbarActionsProps) {
  if (!user) {
    return (
      <div className='flex items-center gap-2'>
        <Link
          href='/sign-in'
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden md:inline-flex')}
        >
          Sign In
        </Link>
        <Link
          href='/sign-up'
          className={cn(buttonVariants({ size: 'sm' }), 'ml-2 hidden md:inline-flex')}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-4'>
      <NotificationPanel />
      <Link
        href='/auctions/new'
        className={cn(
          buttonVariants({ size: 'sm' }),
          'gap-1.5 ml-1 hidden sm:inline-flex',
        )}
      >
        <Plus className='size-3.5' />
        Create Listing
      </Link>
      <div className='hidden sm:block'>
        <UserMenu user={user} profile={profile} />
      </div>
    </div>
  );
}
