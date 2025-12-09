import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as React from 'react'
import type { CoursesFiltersType } from '@/features/courses/data/schema.ts'
import { useFilters } from '@/shared/hooks/use-filters.ts'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const.ts'
import { sortByToState, stateToSortBy } from '@/shared/utils/table.utils.ts'
import { columns as courseColumns } from '@/features/courses/components/table/columns.tsx'
import { getCourses } from '@/features/courses/api/courses.api.ts'
import { CoursesTable } from '@/features/courses/components/table/table.tsx'

export const Route = createFileRoute('/(app)/courses/')({
  component: RouteComponent,
  validateSearch: () => ({}) as CoursesFiltersType,
})

function RouteComponent() {
  const { filters, setFilters } = useFilters(Route.id)

  const { data, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
    placeholderData: keepPreviousData,
  })

  const paginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  }
  const sortingState = sortByToState(filters.sortBy)
  const columns = React.useMemo(() => courseColumns, [])

  return (
    <div>
      <CoursesTable
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
