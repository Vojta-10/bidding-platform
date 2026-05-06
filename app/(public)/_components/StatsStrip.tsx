import { cn } from '@/lib/utils';

const stats = [
  { value: '1,240', label: 'Live Auctions' },
  { value: '$2.4M', label: 'Total Value Traded' },
  { value: '8,500', label: 'Registered Members' },
  { value: '94%', label: 'Satisfaction Rate' },
];

export function StatsStrip() {
  return (
    <section className='border-y border-border bg-muted/30'>
      <div className='grid grid-cols-2 md:grid-cols-4'>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'flex flex-col items-center justify-center py-12 px-6 gap-1.5',
              i % 2 === 0 &&
                i !== stats.length - 1 &&
                'border-r border-border',
              i % 2 !== 0 &&
                i !== stats.length - 1 &&
                'md:border-r md:border-border',
            )}
          >
            <span className='font-heading text-[2rem] leading-none font-bold text-primary'>
              {stat.value}
            </span>
            <span className='text-sm text-muted-foreground'>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
