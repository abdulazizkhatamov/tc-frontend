import * as React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { UsersFiltersType } from '@/features/users/data/schema'
import { getUsers } from '@/features/users/api/users.api'
import { columns as userColumns } from '@/features/users/components/table/columns'
import { UsersTable } from '@/features/users/components/table/table'
import { useFilters } from '@/shared/hooks/use-filters'
import { sortByToState, stateToSortBy } from '@/shared/utils/table.utils'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const'
import { requireRole } from '@/shared/utils/router.utils.ts'

export const Route = createFileRoute('/(app)/users/')({
  component: RouteComponent,
  validateSearch: () => ({}) as UsersFiltersType,
  beforeLoad: ({ context }) => {
    requireRole(context.session.session?.roles ?? [], ['ADMIN'])
  },
})

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.id)

  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
    placeholderData: keepPreviousData,
  })

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  }
  const sortingState = sortByToState(filters.sortBy)
  const columns = React.useMemo(() => userColumns, [])

  return (
    <div>
      <UsersTable
        data={data?.result ?? []}
        columns={columns}
        pagination={paginationState}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            setFilters(
              typeof pagination === 'function'
                ? pagination(paginationState)
                : pagination,
            )
          },
          rowCount: data?.rowCount,
        }}
        filters={filters}
        onFilterChange={(f) => setFilters(f)}
        sorting={sortingState}
        onSortingChange={(updaterOrValue) => {
          const newSortingState =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(sortingState)
              : updaterOrValue
          return setFilters({ sortBy: stateToSortBy(newSortingState) })
        }}
        isLoading={isLoading}
      />
    </div>
  )
}
