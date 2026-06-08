import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ListingsPageRow } from './ListingsPageRow';
import { MyListingsType } from '@/lib/queries/auctions';

export type SortColumn =
  | 'title'
  | 'status'
  | 'current_price'
  | 'bid_count'
  | 'deadline';

export interface SortState {
  column: SortColumn | null;
  direction: 'asc' | 'desc';
}

interface ListingsPageTableProps {
  items: MyListingsType[];
  sort: SortState;
  onSort: (column: SortColumn) => void;
  onEdit: (listing: MyListingsType) => void;
}

interface ColumnDef {
  key: SortColumn;
  label: string;
  className?: string;
}

const COLUMNS: ColumnDef[] = [
  { key: 'title', label: 'Title', className: 'pl-5 w-1/3' },
  { key: 'status', label: 'Status' },
  { key: 'current_price', label: 'Current Price' },
  { key: 'bid_count', label: 'Bids' },
  { key: 'deadline', label: 'Time Left' },
];

function SortIcon({
  column,
  sort,
}: {
  column: SortColumn;
  sort: SortState;
}) {
  if (sort.column !== column)
    return (
      <ArrowUpDown className='ml-1 size-3 opacity-40 group-hover/col:opacity-70' />
    );
  return sort.direction === 'asc' ? (
    <ArrowUp className='ml-1 size-3' />
  ) : (
    <ArrowDown className='ml-1 size-3' />
  );
}

export function ListingsPageTable({
  items,
  sort,
  onSort,
  onEdit,
}: ListingsPageTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          {COLUMNS.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                'group/col cursor-pointer select-none text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                sort.column === col.key && 'text-foreground',
                col.className,
              )}
              onClick={() => onSort(col.key)}
            >
              <span className='inline-flex items-center'>
                {col.label}
                <SortIcon column={col.key} sort={sort} />
              </span>
            </TableHead>
          ))}
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
              No listings match your filters.
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {items.map((listing) => (
            <ListingsPageRow
              key={listing.id}
              listing={listing}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      )}
    </Table>
  );
}
