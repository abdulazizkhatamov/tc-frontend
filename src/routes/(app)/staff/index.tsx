import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/staff/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/staff/"!</div>
}
