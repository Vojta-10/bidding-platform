import { Card } from '@/components/ui/card';
import { ActiveBidsContent } from './ActiveBidsContent';
import type { BidCardData } from '../BidCard';

// Replace with real data: query bids joined with auctions where bidder_id = user.id and status = 'active'
const MOCK_BIDS: BidCardData[] = [
  {
    id: '1',
    title: 'MacBook Pro M3 Max 16" Space Black',
    imageGradient: 'bg-gradient-to-br from-slate-700 to-slate-900',
    currentPrice: 2850,
    yourBid: 2700,
    deadline: new Date(Date.now() + 42 * 60000).toISOString(),
    status: 'outbid',
  },
  {
    id: '2',
    title: 'Vintage Rolex Submariner Date Ref. 1680',
    imageGradient: 'bg-gradient-to-br from-amber-700 to-yellow-900',
    currentPrice: 9400,
    yourBid: 9400,
    deadline: new Date(Date.now() + 3 * 3600000).toISOString(),
    status: 'winning',
  },
  {
    id: '3',
    title: 'Sony A7 IV Mirrorless Camera Body',
    imageGradient: 'bg-gradient-to-br from-zinc-600 to-zinc-800',
    currentPrice: 1950,
    yourBid: 1950,
    deadline: new Date(Date.now() + 18 * 3600000).toISOString(),
    status: 'winning',
  },
  {
    id: '4',
    title: 'Herman Miller Aeron Chair Size B',
    imageGradient: 'bg-gradient-to-br from-teal-700 to-cyan-900',
    currentPrice: 1100,
    yourBid: 980,
    deadline: new Date(Date.now() + 36 * 3600000).toISOString(),
    status: 'outbid',
  },
  {
    id: '5',
    title: 'Gibson Les Paul Standard 60s Bourbon Burst',
    imageGradient: 'bg-gradient-to-br from-orange-800 to-red-900',
    currentPrice: 3200,
    yourBid: 3200,
    deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
    status: 'winning',
  },
  {
    id: '6',
    title: 'Leica M11 Rangefinder Camera Black',
    imageGradient: 'bg-gradient-to-br from-neutral-800 to-neutral-950',
    currentPrice: 8750,
    yourBid: 8500,
    deadline: new Date(Date.now() + 55 * 60000).toISOString(),
    status: 'outbid',
  },
  {
    id: '7',
    title: 'Nike Air Jordan 1 Retro High OG Chicago',
    imageGradient: 'bg-gradient-to-br from-red-700 to-red-950',
    currentPrice: 480,
    yourBid: 480,
    deadline: new Date(Date.now() + 7 * 3600000).toISOString(),
    status: 'winning',
  },
  {
    id: '8',
    title: 'Fender Custom Shop 1959 Stratocaster Relic',
    imageGradient: 'bg-gradient-to-br from-yellow-600 to-amber-800',
    currentPrice: 5600,
    yourBid: 5400,
    deadline: new Date(Date.now() + 29 * 3600000).toISOString(),
    status: 'outbid',
  },
  {
    id: '9',
    title: 'Patek Philippe Calatrava 5227G White Gold',
    imageGradient: 'bg-gradient-to-br from-blue-800 to-indigo-950',
    currentPrice: 31000,
    yourBid: 31000,
    deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
    status: 'winning',
  },
  {
    id: '10',
    title: 'Porsche 911 Carrera Scale Model 1:8 Amalgam',
    imageGradient: 'bg-gradient-to-br from-sky-700 to-blue-900',
    currentPrice: 920,
    yourBid: 920,
    deadline: new Date(Date.now() + 11 * 3600000).toISOString(),
    status: 'winning',
  },
];

export default function ActiveBids() {
  return (
    <Card className='mt-12'>
      <ActiveBidsContent bids={MOCK_BIDS} />
    </Card>
  );
}
