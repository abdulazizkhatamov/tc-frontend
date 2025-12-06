import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { roles, statuses } from '../../data/data'
import { TableColumnHeader } from './table-column-header'
import { TableRowActions } from './table-row-actions'
import type { ColumnDef, RowData } from '@tanstack/react-table'
import type { UsersType } from '../../data/schema'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData
    filterVariant?: 'text' | 'number'
  }
}

export const columns: Array<ColumnDef<UsersType>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] mx-auto"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] mx-auto"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <Link to={'/users/$id'} params={{ id: row.original.id }}>
        <div className="flex items-center space-x-2">
          <span className="max-w-[250px] truncate font-medium hover:underline cursor-pointer">
            {row.getValue('name')}
          </span>
        </div>
      </Link>
    ),
    meta: { filterKey: 'name', filterVariant: 'text' },
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
    accessorKey: 'roles',
    header: ({ column }) => <TableColumnHeader column={column} title="Roles" />,
    cell: ({ row }) => {
      const roleValues: Array<string> = row.getValue('roles')
      const matchedRoles = roleValues
        .map((value) => roles.find((r) => r.value === value))
        .filter(Boolean)

      return (
        <div className="flex flex-wrap gap-2">
          {matchedRoles.map((role) => (
            <Badge
              key={role!.value}
              variant="secondary"
              className="text-xs px-2 py-1"
            >
              {role!.label}
            </Badge>
          ))}
        </div>
      )
    },
    meta: { filterKey: 'roles' },
    enableSorting: false,
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
