import Link from 'next/link';

export default function FooterSlim() {
  return (
    <footer className='border-t bg-muted'>
      <div className='mx-auto max-w-4/5 flex items-center justify-between px-4 py-6 sm:px-6'>
        <Link href='/' className='font-heading text-base font-bold text-primary tracking-tight'>
          AuctionHouse
        </Link>
        <nav aria-label='Footer navigation' className='flex items-center gap-4'>
          <Link
            href='/'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Home
          </Link>
          <Link
            href='/auctions'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Browse
          </Link>
        </nav>
      </div>
    </footer>
  );
}
