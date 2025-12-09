import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { TableRowActions } from './table-row-actions'
import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { CoursesType } from '@/features/courses/data/schema.ts'
import { Badge } from '@/shared/components/ui/badge'
import { TableColumnHeader } from '@/shared/components/table/table-column-header.tsx'
import { statuses } from '@/features/users/data/data.tsx'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData
    filterVariant?: 'text' | 'number'
  }
}

export const columns: Array<ColumnDef<CoursesType>> = [
  {
    accessorKey: 'title',
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => (
      <Link to={'/courses/$id'} params={{ id: row.original.id }}>
        <div className="flex items-center space-x-2">
          <span className="max-w-[250px] truncate font-medium hover:underline cursor-pointer">
            {row.getValue('title')}
          </span>
        </div>
      </Link>
    ),
    meta: { filterKey: 'title', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'durationWeeks',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Duration / W" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="max-w-[300px] truncate text-sm text-gray-600 hover:text-gray-900">
          {row.getValue('durationWeeks')}
        </span>
      </div>
    ),
    meta: { filterKey: 'durationWeeks', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'totalHours',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Total hours" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="max-w-[300px] truncate text-sm text-gray-600 hover:text-gray-900">
          {row.getValue('totalHours')}
        </span>
      </div>
    ),
    meta: { filterKey: 'totalHours', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'fee',
    header: ({ column }) => <TableColumnHeader column={column} title="Fee" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span className="max-w-[300px] truncate text-sm text-gray-600 hover:text-gray-900">
          {row.getValue('fee')}
        </span>
      </div>
    ),
    meta: { filterKey: 'fee', filterVariant: 'text' },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {row.getValue('category')}
          </Badge>
        </div>
      )
    },
    meta: { filterKey: 'category' },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.getValue('status'))
      if (!status) return null

      return (
        <div className="flex items-center gap-2 w-[120px]">
          <status.icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    meta: { filterKey: 'status' },
    enableSorting: true,
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
