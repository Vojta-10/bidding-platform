export type ListingStatus = 'active' | 'closed';

export const statusConfig: Record<
  ListingStatus,
  { label: string; dot: string; pill: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-muted-foreground/40',
    pill: 'bg-muted text-muted-foreground',
  },
};
