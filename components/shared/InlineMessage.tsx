import { cn } from '@/lib/utils';
import { CircleCheck, Info, OctagonX, TriangleAlert } from 'lucide-react';

type Variant = 'success' | 'error' | 'warning' | 'info';

interface InlineMessageProps {
  variant: Variant;
  title: string;
  description?: string;
  /** Optional action, e.g. a retry button */
  action?: React.ReactNode;
  className?: string;
}

const config: Record<Variant, { icon: React.ElementType; classes: string }> = {
  success: {
    icon: CircleCheck,
    classes: 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400',
  },
  error: {
    icon: OctagonX,
    classes: 'border-destructive/20 bg-destructive/10 text-destructive',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  info: {
    icon: Info,
    classes: 'border-border bg-muted text-muted-foreground',
  },
};

export function InlineMessage({
  variant,
  title,
  description,
  action,
  className,
}: InlineMessageProps) {
  const { icon: Icon, classes } = config[variant];

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4', classes, className)}>
      <Icon className='mt-0.5 size-4 shrink-0' />
      <div className='flex flex-1 flex-col gap-1'>
        <p className='text-sm font-medium leading-none'>{title}</p>
        {description && (
          <p className='text-xs leading-relaxed opacity-80'>{description}</p>
        )}
        {action && <div className='mt-2'>{action}</div>}
      </div>
    </div>
  );
}
