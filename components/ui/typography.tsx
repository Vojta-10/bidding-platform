import { cn } from '@/lib/utils';

function H1({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('text-4xl font-bold tracking-tight', className)}
      {...props}
    />
  );
}

function H2({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function H3({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function H4({ className, ...props }: React.ComponentProps<'h4'>) {
  return (
    <h4 className={cn('text-xl font-semibold', className)} {...props} />
  );
}

function Lead({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-xl text-muted-foreground', className)}
      {...props}
    />
  );
}

function Subtitle({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-base text-muted-foreground', className)}
      {...props}
    />
  );
}

function Muted({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export { H1, H2, H3, H4, Lead, Subtitle, Muted };
