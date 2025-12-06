import { createFileRoute } from '@tanstack/react-router'
import CreateUserForm from '@/features/users/components/form/create-user-form'

export const Route = createFileRoute('/(app)/users/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full max-w-md mx-auto">
      <CreateUserForm />
    </div>
  )
}
