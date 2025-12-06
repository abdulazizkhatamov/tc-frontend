import { queryOptions } from '@tanstack/react-query'
import { getUser } from '@/features/users/api/users.api.ts'

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['user', { id }],
    queryFn: () => getUser(id),
  })
