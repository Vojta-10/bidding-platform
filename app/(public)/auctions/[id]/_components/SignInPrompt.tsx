import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface SignInPromptProps {
  auctionId: string;
}

export function SignInPrompt({ auctionId }: SignInPromptProps) {
  return (
    <div className='flex flex-col items-center gap-4 py-2 text-center'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
        <Lock className='size-5 text-muted-foreground' />
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-sm font-medium'>Sign in to place a bid</p>
        <p className='text-xs text-muted-foreground'>
          Join the auction and compete for this item
        </p>
      </div>
      <Link
        href={`/sign-in?redirect=/auctions/${auctionId}`}
        className={cn(buttonVariants(), 'w-full')}
      >
        Sign In
      </Link>
    </div>
  );
}
