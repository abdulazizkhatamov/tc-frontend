import { queryOptions } from '@tanstack/react-query'
import { getUser } from '@/features/users/api/users.api.ts'

export const leadQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['lead', { id }],
    queryFn: () => getUser(id),
  })
