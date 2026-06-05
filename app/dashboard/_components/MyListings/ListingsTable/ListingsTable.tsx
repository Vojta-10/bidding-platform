import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ListingsTableBodyRow } from './ListingsTableBodyRow';
import { MyListingsType } from '@/lib/queries/auctions';

export function ListingsTable({ items }: { items: MyListingsType[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead className='pl-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-1/3'>
            Title
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Status
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Current Price
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Bids
          </TableHead>
          <TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Time Left
          </TableHead>
          <TableHead className='pr-5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      {items.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={6}
              className='py-10 text-center text-sm text-muted-foreground'
            >
              No listings yet.
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <ListingsTableBodyRow items={items} />
      )}
    </Table>
  );
}
