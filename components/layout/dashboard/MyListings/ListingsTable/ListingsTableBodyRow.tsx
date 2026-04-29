'use client';

import { TableBody } from '@/components/ui/table';
import { type Listing } from '../types';
import TableListing from './ListingsTableListing';

interface ListingsTableBodyRowProps {
  items: Listing[];
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
