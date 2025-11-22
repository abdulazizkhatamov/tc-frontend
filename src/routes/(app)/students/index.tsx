import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/students/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/students/"!</div>
}
