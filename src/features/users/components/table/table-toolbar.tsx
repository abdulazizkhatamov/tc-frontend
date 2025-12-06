import { IconPlus, IconX } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { roles } from '../../data/data'
import { TableViewOptions } from './table-view-options'
import { TableFacetedFilter } from './table-faceted-filter'
import type { Table } from '@tanstack/react-table'
import type { Filters } from '@/shared/types/api.type'
import { Button } from '@/shared/components/ui/button'
import { DebouncedInput } from '@/shared/components/ui/debounced-input'

interface TableToolbarProps<TData> {
  table: Table<TData>
  filters: Filters<TData>
  onFilterChange: (dataFilters: Partial<TData>) => void
}

export function TableToolbar<TData>({
  table,
  filters,
  onFilterChange,
}: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const fieldMeta = table.getColumn('name')?.columnDef.meta

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('name')?.getCanFilter() &&
        fieldMeta?.filterKey !== undefined ? (
          <DebouncedInput
            type="text"
            placeholder="Filter tasks..."
            value={String(filters[fieldMeta.filterKey] ?? '')}
            onChange={(value) => {
              onFilterChange({
                [fieldMeta.filterKey as keyof TData]: value,
              } as Partial<TData>)
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : null}
        {table.getColumn('roles') && (
          <TableFacetedFilter
            column={table.getColumn('roles')}
            title="Roles"
            options={roles}
            onFilterChange={onFilterChange}
            filters={filters}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <IconX />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <TableViewOptions table={table} />
        <Link to="/users/create">
          <Button size={'sm'}>
            <IconPlus />
            Create
          </Button>
        </Link>
      </div>
    </div>
  )
}
