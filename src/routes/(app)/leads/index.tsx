import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/leads/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/leads/"!</div>
}
