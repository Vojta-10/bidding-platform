interface AuctionMetaProps {
  title: string;
  description: string;
  seller: { username: string };
  createdAt: string;
}

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function AuctionMeta({ title, description, seller, createdAt }: AuctionMetaProps) {
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='font-heading text-2xl font-semibold leading-tight tracking-tight'>
        {title}
      </h1>
      <p className='text-sm text-muted-foreground'>
        Listed by{' '}
        <span className='font-medium text-foreground'>@{seller.username}</span>
        {' · '}
        {formatRelativeDate(createdAt)}
      </p>
      <p className='text-sm text-muted-foreground leading-relaxed'>{description}</p>
    </div>
  );
}
