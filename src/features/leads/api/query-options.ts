import { queryOptions } from '@tanstack/react-query'
import { getLead } from '@/features/leads/api/leads.api.ts'

export const leadQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['lead', { id }],
    queryFn: () => getLead(id),
  })
