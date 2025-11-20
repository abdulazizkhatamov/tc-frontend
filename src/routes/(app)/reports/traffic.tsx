import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/reports/traffic')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/reports/traffic"!</div>
}
