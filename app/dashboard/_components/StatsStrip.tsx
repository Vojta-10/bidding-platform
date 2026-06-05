import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { MyListingsType } from '@/lib/queries/auctions';
import { calcTimeLeft, formatCurrency } from '@/lib/utils';
import { Activity, Trophy, Tags, DollarSign } from 'lucide-react';

interface StatsStripProps {
  wonAuctions: number;
  recentlyWonAuctions: number;
  totalSpent: number;
  thisMonth: number;
  activeBids: number;
  endingToday: number;
  myListings: MyListingsType[];
}

export default function StatsStrip({
  wonAuctions,
  recentlyWonAuctions,
  totalSpent,
  thisMonth,
  activeBids,
  endingToday,
  myListings,
}: StatsStripProps) {
  const myListingEndingSoonCount = myListings.filter((listing) => {
    return calcTimeLeft(listing.deadline).urgent;
  }).length;

  const myListingActiveCount = myListings.filter((listing) => {
    return listing.status === 'active';
  }).length;
  const myListingEndedCount = myListings.length - myListingActiveCount;

  const stats = [
    {
      label: 'Active Bids',
      value: activeBids,
      sub: `${endingToday} ending today`,
      Icon: Activity,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Auctions Won',
      value: wonAuctions,
      sub: `${recentlyWonAuctions} this month`,
      Icon: Trophy,
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      label: 'My Listings',
      value: myListingActiveCount,
      sub: `${myListingEndingSoonCount} ending soon`,
      ended: `${myListingEndedCount} ended`,
      Icon: Tags,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Spent',
      value: `${formatCurrency(totalSpent)}`,
      sub: `↑ ${formatCurrency(thisMonth)} this month`,
      Icon: DollarSign,
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
    },
  ];
  return (
    <div className='grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map(({ label, value, sub, Icon, iconBg, iconColor, ended }) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle className='text-sm font-medium text-muted-foreground sm:text-base'>
              {label}
            </CardTitle>
            <CardAction>
              <div className={`rounded-lg p-1.5 sm:p-2 ${iconBg}`}>
                <Icon className={`size-3.5 sm:size-4 ${iconColor}`} />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className='text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl'>
              {value}
            </p>
            {ended ? (
              <div className='mt-1 flex justify-between'>
                <p className='mt-1 text-xs text-muted-foreground'>{sub}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{ended}</p>
              </div>
            ) : (
              <p className='mt-2 text-xs text-muted-foreground'>{sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
