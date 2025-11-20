import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/reports/sales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/reports/sales"!</div>
}
