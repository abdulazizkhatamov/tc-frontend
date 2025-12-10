import {
  ErrorComponent,
  createFileRoute,
  useRouter,
} from '@tanstack/react-router'
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import * as React from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { leadQueryOptions } from '@/features/leads/api/query-options.ts'
import { LeadNotFoundError } from '@/features/leads/api/leads.api.ts'
import PatchLeadForm from '@/features/leads/components/form/patch-lead-form.tsx'

export const Route = createFileRoute('/(app)/leads/$id/edit')({
  component: RouteComponent,
  errorComponent: LeadErrorComponent,
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(leadQueryOptions(id))
  },
})

function LeadErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()
  if (error instanceof LeadNotFoundError) {
    return <div>{error.message}</div>
  }
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  React.useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div>
      <button
        onClick={() => {
          router.invalidate()
        }}
      >
        Retry
      </button>
      <ErrorComponent error={error} />
    </div>
  )
}

function RouteComponent() {
  const leadId = Route.useParams().id
  const { data: lead } = useSuspenseQuery(leadQueryOptions(leadId))

  return (
    <div className="w-full max-w-md mx-auto">
      <PatchLeadForm lead={lead} />
    </div>
  )
}
