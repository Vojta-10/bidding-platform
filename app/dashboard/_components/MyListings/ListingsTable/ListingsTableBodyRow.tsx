'use client';

import { TableBody } from '@/components/ui/table';
import TableListing from './ListingsTableListing';
import { MyListingsType } from '@/lib/queries/auctions';

interface ListingsTableBodyRowProps {
  items: MyListingsType[];
}

export function ListingsTableBodyRow({ items }: ListingsTableBodyRowProps) {
  return (
    <TableBody>
      {items.map((listing) => {
        return <TableListing key={listing.id} listing={listing} />;
      })}
    </TableBody>
  );
}
