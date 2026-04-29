import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  count: number;
  isActive: boolean;
  activeColor: string;
  dotColor?: string;
  onClick: () => void;
}

export function FilterChip({
  label,
  count,
  isActive,
  activeColor,
  dotColor,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type='button'
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        isActive
          ? activeColor
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
      )}
    >
      {isActive && dotColor && (
        <span className={cn('size-1.5 rounded-full', dotColor)} />
      )}
      {label}
      <span
        className={cn(
          'rounded-full px-1 tabular-nums',
          isActive ? 'opacity-75' : 'opacity-60',
        )}
      >
        {count}
      </span>
    </button>
  );
}
