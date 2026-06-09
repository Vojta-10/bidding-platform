import { cn } from '@/lib/utils';
import { HomeStats } from '@/lib/queries/auctions';

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function StatsStrip({ stats }: { stats: HomeStats }) {
  const items = [
    { value: stats.liveAuctions.toLocaleString(), label: 'Live Auctions' },
    { value: formatCompact(stats.totalValueTraded), label: 'Total Value Traded' },
    { value: stats.registeredMembers.toLocaleString(), label: 'Registered Members' },
    { value: '94%', label: 'Satisfaction Rate' },
  ];

  return (
    <section className='border border-border bg-muted/30'>
      <div className='max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4'>
        {items.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'flex flex-col items-center justify-center py-8 md:py-12 px-6 gap-1.5',
              (i === 0 || i === 2) && 'border-r border-border',
              i === 1 && 'md:border-r md:border-border',
              i >= 2 && 'border-t border-border md:border-t-0',
            )}
          >
            <span className='font-heading text-[2rem] leading-none font-bold text-primary'>
              {stat.value}
            </span>
            <span className='text-sm text-muted-foreground'>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
