'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'deadline', label: 'Ending Soon' },
  { value: 'current_price_asc', label: 'Price: Low to High' },
  { value: 'current_price_desc', label: 'Price: High to Low' },
  { value: 'bid_count', label: 'Most Bids' },
];

export type SortOption =
  | 'deadline'
  | 'current_price_asc'
  | 'current_price_desc'
  | 'bid_count';

export default function SortPanel() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  let val = '';
  if (
    searchParams.get('type') === 'current_price' &&
    searchParams.get('ascending') === 'true'
  ) {
    val = 'current_price_asc';
  } else if (
    searchParams.get('type') === 'current_price' &&
    searchParams.get('ascending') === 'false'
  ) {
    val = 'current_price_desc';
  }
  return (
    <select
      value={val || searchParams.get('type') || 'dealine'}
      onChange={(e) => {
        const asc =
          e.target.value === 'current_price_desc' ||
          e.target.value === 'bid_count'
            ? 'false'
            : 'true';
        const t =
          e.target.value === 'current_price_desc' ||
          e.target.value === 'current_price_asc'
            ? 'current_price'
            : e.target.value;

        const params = new URLSearchParams(searchParams.toString());
        params.set('type', t);
        params.set('ascending', asc);
        params.delete('failedFetch');
        router.push(`${pathname}?${params.toString()}`);
      }}
      className='h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer'
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
