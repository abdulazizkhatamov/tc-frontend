import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { TableRowActions } from './table-row-actions'
import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { LeadsType } from '../../data/schema'
import { Badge } from '@/shared/components/ui/badge'
import { TableColumnHeader } from '@/shared/components/table/table-column-header.tsx'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData
    filterVariant?: 'text' | 'number'
  }
}

export const columns: Array<ColumnDef<LeadsType>> = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Full name" />
    ),
    cell: ({ row }) => (
      <Link to={'/leads/$id'} params={{ id: row.original.id }}>
        <div className="flex items-center space-x-2">
          <span className="max-w-[250px] truncate font-medium hover:underline cursor-pointer">
            {row.getValue('fullName')}
          </span>
        </div>
      </Link>
    ),
    meta: { filterKey: 'fullName', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="max-w-[300px] truncate text-sm text-gray-600 hover:text-gray-900">
          {row.getValue('email')}
        </span>
      </div>
    ),
    meta: { filterKey: 'email', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => <TableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      const phone = row.getValue('phone')
      // Ensure we only render string or placeholder
      const displayPhone =
        typeof phone === 'string' && phone.trim() !== '' ? phone : '—'

      return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {displayPhone}
        </div>
      )
    },
    meta: { filterKey: 'phone', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {row.getValue('source')}
          </Badge>
        </div>
      )
    },
    meta: { filterKey: 'source' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    meta: { filterKey: 'status' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {row.getValue('priority')}
          </Badge>
        </div>
      )
    },
    meta: { filterKey: 'priority' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {format(new Date(row.getValue('createdAt')), 'PPP')}
      </div>
    ),
    meta: { filterKey: 'createdAt', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2 min-w-[80px]">
        <TableRowActions row={row} />
      </div>
    ),
  },
]
