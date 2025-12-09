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
import { UserNotFoundError } from '@/features/users/api/users.api.ts'
import { courseQueryOptions } from '@/features/courses/api/query-options.ts'
import PatchCourseForm from '@/features/courses/components/form/patch-course-form.tsx'

export const Route = createFileRoute('/(app)/courses/$id/edit')({
  component: RouteComponent,
  errorComponent: CourseErrorComponent,
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(courseQueryOptions(id))
  },
})

function CourseErrorComponent({ error }: ErrorComponentProps) {
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
  const courseId = Route.useParams().id
  const { data: course } = useSuspenseQuery(courseQueryOptions(courseId))

  return (
    <div className="w-full max-w-md mx-auto">
      <PatchCourseForm course={course} />
    </div>
  )
}
