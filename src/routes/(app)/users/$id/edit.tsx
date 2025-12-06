import * as React from 'react'
import {
  ErrorComponent,
  createFileRoute,
  useRouter,
} from '@tanstack/react-router'
import {
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import PatchUserForm from '@/features/users/components/form/patch-user-form.tsx'
import { userQueryOptions } from '@/features/users/api/query-options.ts'
import { UserNotFoundError } from '@/features/users/api/users.api.ts'

export const Route = createFileRoute('/(app)/users/$id/edit')({
  component: RouteComponent,
  errorComponent: UserErrorComponent,
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(userQueryOptions(id))
  },
})

function UserErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()
  if (error instanceof UserNotFoundError) {
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
  const userId = Route.useParams().id
  const { data: user } = useSuspenseQuery(userQueryOptions(userId))

  return (
    <div className="w-full max-w-md mx-auto">
      <PatchUserForm user={user} />
    </div>
  )
}
