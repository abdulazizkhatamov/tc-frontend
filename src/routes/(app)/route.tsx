import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session.session) {
      throw redirect({ to: '/login' })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
