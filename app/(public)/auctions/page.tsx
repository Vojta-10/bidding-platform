import { getAuctions } from '@/lib/queries/auctions';
import { BrowsePage } from './_components/BrowsePage';
import ErrorToast from './_components/ErrorToast';

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    statusOption?: string;
    priceMin?: string;
    priceMax?: string;
    deadline?: string;
    type?: string;
    ascending?: string;
    failedFetch?: string;
  }>;
}) {
  const { query, priceMin, priceMax, deadline, type, ascending, failedFetch } =
    await searchParams;
  const filter = {
    query: query || '',
    priceMin: priceMin || '',
    priceMax: priceMax || '',
    deadline: deadline || 'any',
  };
  const activeFilterCount = Object.values(filter).filter(
    (v) => v !== '' && v !== 'all' && v !== 'any',
  ).length;
  const sort = {
    type: type || 'deadline',
    ascending: ascending || 'true',
  };
  const auctions = await getAuctions(filter, sort);
  return (
    <>
      <BrowsePage auctions={auctions} activeFilterCount={activeFilterCount} />
      <ErrorToast failed={failedFetch || ''}></ErrorToast>
    </>
  );
}
