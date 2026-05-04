'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, Plus, Gavel, LayoutDashboard, ListOrdered, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from '@/components/ui/sheet';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/actions/auth';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/database';

interface NavbarMobileProps {
  user: User | null;
  profile: Profile | null;
}

export function NavbarMobile({ user, profile }: NavbarMobileProps) {
  const [open, setOpen] = useState(false);

  const initial =
    profile?.username?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className='min-[940]:hidden flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
        aria-label='Open menu'
      >
        <Menu className='size-5' />
      </SheetTrigger>

      <SheetContent side='left' className='w-72 p-0 flex flex-col'>
        <div className='flex items-center h-16 px-5 border-b'>
          <SheetClose render={<Link href='/' />} nativeButton={false} className='font-heading text-xl font-bold text-primary tracking-tight'>
            AuctionHouse
          </SheetClose>
        </div>

        <div className='px-4 pt-4'>
          <form action='/auctions' method='GET' onSubmit={() => setOpen(false)}>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none' />
              <input
                name='q'
                type='search'
                placeholder='Search auctions...'
                className='w-full rounded-lg border border-input bg-muted/40 py-2 pl-9 pr-4 text-sm outline-none focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground'
              />
            </div>
          </form>
        </div>

        <nav className='flex flex-col gap-1 px-3 pt-4'>
          <p className='px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Browse
          </p>
          <SheetClose
            render={<Link href='/auctions' />}
            nativeButton={false}
            className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Browse All
          </SheetClose>
          <SheetClose
            render={<Link href='/auctions?filter=live' />}
            nativeButton={false}
            className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Live Now
          </SheetClose>
          <SheetClose
            render={<Link href='/auctions?filter=ending' />}
            nativeButton={false}
            className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Ending Soon
          </SheetClose>
        </nav>

        <div className='mt-auto border-t px-4 py-4 flex flex-col gap-2'>
          {user ? (
            <>
              <div className='flex items-center gap-3 mb-2 px-1'>
                <span className='flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shrink-0'>
                  {initial}
                </span>
                <span className='text-sm font-medium truncate'>
                  {profile?.username ?? user.email}
                </span>
              </div>
              <SheetClose
                render={<Link href='/auctions/new' />}
                nativeButton={false}
                className={cn(buttonVariants({ size: 'sm' }), 'w-full gap-1.5 min-[450]:w-1/2')}
              >
                <Plus className='size-3.5' />
                Create Listing
              </SheetClose>
              <SheetClose
                render={<Link href='/dashboard' />}
                nativeButton={false}
                className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <LayoutDashboard className='size-4' />
                Dashboard
              </SheetClose>
              <SheetClose
                render={<Link href='/dashboard/bids' />}
                nativeButton={false}
                className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <Gavel className='size-4' />
                My Bids
              </SheetClose>
              <SheetClose
                render={<Link href='/dashboard/listings' />}
                nativeButton={false}
                className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <ListOrdered className='size-4' />
                My Listings
              </SheetClose>
              <SheetClose
                render={<button onClick={() => signOut()} />}
                className='flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left'
              >
                <LogOut className='size-4' />
                Sign Out
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose
                render={<Link href='/sign-in' />}
                nativeButton={false}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
              >
                Sign In
              </SheetClose>
              <SheetClose
                render={<Link href='/sign-up' />}
                nativeButton={false}
                className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
              >
                Sign Up
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
