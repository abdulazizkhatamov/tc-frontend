import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/403')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Forbidden</div>
}
