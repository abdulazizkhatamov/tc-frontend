import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { LeadsFiltersType } from '@/features/leads/data/schema.ts'
import { sortByToState, stateToSortBy } from '@/shared/utils/table.utils.ts'
import { useFilters } from '@/shared/hooks/use-filters.ts'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const.ts'
import { columns as leadColumns } from '@/features/leads/components/table/columns.tsx'
import { requireRole } from '@/shared/utils/router.utils.ts'
import { LeadsTable } from '@/features/leads/components/table/table.tsx'
import { getLeads } from '@/features/leads/api/leads.api.ts'

export const Route = createFileRoute('/(app)/leads/')({
  component: RouteComponent,
  validateSearch: () => ({}) as LeadsFiltersType,
  beforeLoad: ({ context }) => {
    requireRole(context.session.session?.roles ?? [], ['ADMIN'])
  },
})

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.id)

  const { data, isLoading } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
    placeholderData: keepPreviousData,
  })

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  }
  const sortingState = sortByToState(filters.sortBy)
  const columns = React.useMemo(() => leadColumns, [])

  return (
    <div>
      <LeadsTable
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
