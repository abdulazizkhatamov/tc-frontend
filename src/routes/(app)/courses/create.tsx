import { createFileRoute } from '@tanstack/react-router'
import CreateCourseForm from '@/features/courses/components/form/create-course-form.tsx'

export const Route = createFileRoute('/(app)/courses/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-md mx-auto">
      <CreateCourseForm />
    </div>
  )
}
