import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/components/ui/card';
import { Activity, Trophy, Tags, DollarSign } from 'lucide-react';

const stats = [
  {
    label: 'Active Bids',
    value: '4',
    sub: '2 ending today',
    Icon: Activity,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Auctions Won',
    value: '12',
    sub: '3 this month',
    Icon: Trophy,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600',
  },
  {
    label: 'My Listings',
    value: '2',
    sub: '1 ending soon',
    Icon: Tags,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Total Spent',
    value: '$4,500',
    sub: '↑ $800 this month',
    Icon: DollarSign,
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
  },
];

export default function StatsStrip() {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {stats.map(({ label, value, sub, Icon, iconBg, iconColor }) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle className='text-xl font-medium text-muted-foreground'>
              {label}
            </CardTitle>
            <CardAction>
              <div className={`rounded-lg p-2 ${iconBg}`}>
                <Icon className={`size-4 ${iconColor}`} />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold tracking-tight'>{value}</p>
            <p className='mt-1 text-xs text-muted-foreground'>{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
