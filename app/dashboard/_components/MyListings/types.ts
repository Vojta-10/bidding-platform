export type ListingStatus = 'active' | 'sold' | 'closed';

export interface Listing {
  id: string;
  title: string;
  status: ListingStatus;
  currentPrice: number;
  bids: number;
  deadline: string;
}

export const statusConfig: Record<
  ListingStatus,
  { label: string; dot: string; pill: string }
> = {
  active: {
    label: 'Active',
    dot: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  sold: {
    label: 'Sold',
    dot: 'bg-green-500',
    pill: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  closed: {
    label: 'Closed',
    dot: 'bg-muted-foreground/40',
    pill: 'bg-muted text-muted-foreground',
  },
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Vintage Leica M3 Camera — 1954 Double Stroke',
    status: 'active',
    currentPrice: 1850,
    bids: 7,
    deadline: '2026-04-30T20:00:00.000Z',
  },
  {
    id: '2',
    title: 'Eames Lounge Chair & Ottoman, Herman Miller',
    status: 'active',
    currentPrice: 3200,
    bids: 12,
    deadline: '2026-04-29T23:30:00.000Z',
  },
  {
    id: '3',
    title: 'Gibson Les Paul Standard 1959 Reissue',
    status: 'sold',
    currentPrice: 5400,
    bids: 23,
    deadline: '2026-04-28T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Patek Philippe Calatrava Ref. 5227G',
    status: 'closed',
    currentPrice: 28000,
    bids: 4,
    deadline: '2026-04-27T10:00:00.000Z',
  },
  {
    id: '5',
    title: 'Patek Philippe Calatrava Ref. 5227G',
    status: 'closed',
    currentPrice: 28000,
    bids: 4,
    deadline: '2026-04-27T10:00:00.000Z',
  },
  {
    id: '6',
    title: 'Patek Philippe Calatrava Ref. 5227G',
    status: 'closed',
    currentPrice: 28000,
    bids: 4,
    deadline: '2026-04-27T10:00:00.000Z',
  },
];
