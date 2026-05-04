import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { NavbarActions } from './NavbarActions';
import { NavbarMobile } from './NavbarMobile';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <header className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm'>
      <div className='mx-auto flex h-16 justify-center items-center gap-4 px-4 sm:px-6'>
        <NavbarMobile user={user} profile={profile} />

        <Link href='/' className='mr-5'>
          <span className='font-heading text-xl font-bold text-primary tracking-tight'>
            AuctionHouse
          </span>
        </Link>

        <nav className='hidden min-[940]:flex items-center gap-0.5 ml-2'>
          <Link
            href='/auctions'
            className='rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Browse
          </Link>
          <Link
            href='/auctions?filter=live'
            className='rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Live Now
          </Link>
          <Link
            href='/auctions?filter=ending'
            className='rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
          >
            Ending Soon
          </Link>
        </nav>

        <form
          action='/auctions'
          method='GET'
          className='flex-1 max-w-sm mx-auto hidden md:block'
        >
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

        <div className='ml-auto shrink-0'>
          <NavbarActions user={user} profile={profile} />
        </div>
      </div>
    </header>
  );
}
