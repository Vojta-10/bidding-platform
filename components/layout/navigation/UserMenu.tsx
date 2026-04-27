'use client';

import Link from 'next/link';
import { ChevronDown, LayoutDashboard, Gavel, ListOrdered, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/actions/auth';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

interface UserMenuProps {
  user: User;
  profile: Profile | null;
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const initial =
    profile?.username?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-muted transition-colors outline-none'>
        <span className='flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold'>
          {initial}
        </span>
        <span className='hidden sm:block text-sm'>
          {profile?.username ?? 'Account'}
        </span>
        <ChevronDown className='size-3.5 text-muted-foreground' />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' sideOffset={8} className='w-48'>
        <DropdownMenuItem>
          <Link href='/dashboard' className='flex items-center gap-2.5 w-full'>
            <LayoutDashboard className='size-4 text-muted-foreground' />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/dashboard/bids' className='flex items-center gap-2.5 w-full'>
            <Gavel className='size-4 text-muted-foreground' />
            My Bids
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href='/dashboard/listings' className='flex items-center gap-2.5 w-full'>
            <ListOrdered className='size-4 text-muted-foreground' />
            My Listings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={() => signOut()}>
          <LogOut className='size-4' />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
