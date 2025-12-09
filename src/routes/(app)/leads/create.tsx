import { createFileRoute } from '@tanstack/react-router'
import CreateLeadForm from '@/features/leads/components/form/create-lead-form.tsx'
import { useSession } from '@/features/session/hooks/use-session.ts'

export const Route = createFileRoute('/(app)/leads/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = useSession()
  return (
    <div className="w-full max-w-md mx-auto">
      {session && session.id && <CreateLeadForm userId={session.id} />}
    </div>
  )
}
