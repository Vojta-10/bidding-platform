'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ActiveBidsTab } from './ActiveBidsTab';
import { HistoryBidsTab } from './HistoryBidsTab';
import { activeBidsType, historyBidsType } from '@/lib/queries/auctions';

interface BidsPageContentProps {
  activeBids: activeBidsType[];
  historyBids: historyBidsType[];
}

export default function BidsPageContent({
  activeBids,
  historyBids,
}: BidsPageContentProps) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <Link
          href='/dashboard'
          className='inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
        >
          <ArrowLeft className='size-3.5' />
          Back to dashboard
        </Link>
        <h1 className='font-heading text-3xl font-semibold'>My Bids</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your active bids and review past auctions.
        </p>
      </div>

      <Tabs defaultValue='active'>
        <TabsList>
          <TabsTrigger value='active'>
            Active
            <span className='rounded-full bg-muted px-1.5 text-xs tabular-nums'>
              {activeBids.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value='history'>
            History
            <span className='rounded-full bg-muted px-1.5 text-xs tabular-nums'>
              {historyBids.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='pt-4'>
          <ActiveBidsTab bids={activeBids} />
        </TabsContent>
        <TabsContent value='history' className='pt-4'>
          <HistoryBidsTab bids={historyBids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
