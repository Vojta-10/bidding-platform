import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface AuctionImageProps {
  imageUrl: string | null;
  title: string;
}

export function AuctionImage({ imageUrl, title }: AuctionImageProps) {
  if (!imageUrl) {
    return (
      <div className='aspect-video w-full rounded-xl bg-muted ring-1 ring-border flex items-center justify-center'>
        <ImageIcon className='size-16 text-muted-foreground/20' />
      </div>
    );
  }

  return (
    <div className='relative aspect-video w-full rounded-xl overflow-hidden ring-1 ring-border'>
      <Image loading={'eager'} src={imageUrl} alt={title} fill className='object-cover' />
    </div>
  );
}
