import Link from 'next/link';

const exploreLinks = [
  { label: 'Browse', href: '/auctions' },
  { label: 'Live Now', href: '/auctions?filter=live' },
  { label: 'Ending Soon', href: '/auctions?filter=ending' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className='border-t bg-muted'>
      <div className='mx-auto max-w-4/5 px-4 sm:px-6'>
        <div className='grid grid-cols-1 gap-8 py-10 md:grid-cols-3'>
          {/* Brand */}
          <div className='flex flex-col gap-2'>
            <Link href='/' className='font-heading text-xl font-bold text-primary tracking-tight'>
              AuctionHouse
            </Link>
            <p className='text-sm text-muted-foreground'>
              Where great things find their value.
            </p>
          </div>

          {/* Explore */}
          <div className='flex flex-col gap-3'>
            <h3 className='text-sm font-semibold text-foreground'>Explore</h3>
            <ul className='flex flex-col gap-2'>
              {exploreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className='flex flex-col gap-3'>
            <h3 className='text-sm font-semibold text-foreground'>Company</h3>
            <ul className='flex flex-col gap-2'>
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className='border-t border-border pb-8 pt-6'>
          <p className='text-xs text-muted-foreground'>
            © 2026 AuctionHouse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
