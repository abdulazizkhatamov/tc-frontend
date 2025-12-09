import { queryOptions } from '@tanstack/react-query'
import { getCourse } from '@/features/courses/api/courses.api.ts'

export const courseQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['course', { id }],
    queryFn: () => getCourse(id),
  })
