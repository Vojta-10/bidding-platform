import { ElementType } from 'react';
import { Gavel, Trophy, TrendingUp, Eye, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ActivityType = 'outbid' | 'won' | 'placed' | 'watching' | 'raised';

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

const iconMap: Record<
  ActivityType,
  { Icon: ElementType; bg: string; color: string }
> = {
  outbid: {
    Icon: TrendingDown,
    bg: 'bg-destructive/10',
    color: 'text-destructive',
  },
  won: {
    Icon: Trophy,
    bg: 'bg-green-500/10',
    color: 'text-green-600 dark:text-green-400',
  },
  placed: { Icon: Gavel, bg: 'bg-primary/10', color: 'text-primary' },
  watching: {
    Icon: Eye,
    bg: 'bg-blue-500/10',
    color: 'text-blue-600 dark:text-blue-400',
  },
  raised: {
    Icon: TrendingUp,
    bg: 'bg-amber-500/10',
    color: 'text-amber-600 dark:text-amber-400',
  },
};

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'outbid',
    description: 'You were outbid on MacBook Pro M3 Max',
    timestamp: '2m ago',
  },
  {
    id: '2',
    type: 'placed',
    description: 'Bid placed on Vintage Rolex Submariner',
    timestamp: '14m ago',
  },
  {
    id: '3',
    type: 'won',
    description: 'You won Sony A7 IV Mirrorless Camera',
    timestamp: '1h ago',
  },
  {
    id: '4',
    type: 'raised',
    description: 'You raised your bid on Leica M11',
    timestamp: '2h ago',
  },
  {
    id: '5',
    type: 'outbid',
    description: 'You were outbid on Herman Miller Aeron Chair',
    timestamp: '3h ago',
  },
  {
    id: '6',
    type: 'watching',
    description: 'Started watching Gibson Les Paul Standard',
    timestamp: '5h ago',
  },
  {
    id: '7',
    type: 'placed',
    description: 'Bid placed on Fender Custom Shop Stratocaster',
    timestamp: '6h ago',
  },
  {
    id: '8',
    type: 'won',
    description: 'You won Nike Air Jordan 1 Retro Chicago',
    timestamp: '1d ago',
  },
  {
    id: '9',
    type: 'watching',
    description: 'Started watching Patek Philippe Calatrava',
    timestamp: '1d ago',
  },
  {
    id: '10',
    type: 'raised',
    description: 'You raised your bid on Porsche 911 Scale Model',
    timestamp: '2d ago',
  },
];

export default function RecentActivity() {
  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <h2 className='font-heading text-2xl font-semibold pl-2'>
          Recent Activity
        </h2>
      </CardHeader>
      <CardContent className='p-0'>
        {MOCK_ACTIVITY.length === 0 ? (
          <p className='px-6 py-8 text-center text-sm text-muted-foreground'>
            No recent activity yet.
          </p>
        ) : (
        <ul className='max-h-105 overflow-y-auto'>
          {MOCK_ACTIVITY.map((item, i) => {
            const { Icon, bg, color } = iconMap[item.type];
            return (
              <li
                key={item.id}
                className={cn(
                  'flex items-start gap-3 px-6 py-3',
                  i < MOCK_ACTIVITY.length - 1 && 'border-b border-border/50',
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
                    bg,
                  )}
                >
                  <Icon className={cn('size-3.5', color)} />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm leading-snug'>{item.description}</p>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {item.timestamp}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        )}
      </CardContent>
    </Card>
  );
}
