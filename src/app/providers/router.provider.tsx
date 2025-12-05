// tanstackRouter.provider.tsx
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '@/routeTree.gen'
import { getContext } from '@/app/providers/query.provider'
import { useSession } from '@/features/session/hooks/useSession'
import { LoadingSpinner } from '@/shared/components/loading-backdrop'

// Single context shared across router + providers
const context = getContext()

const router = createRouter({
  routeTree,
  context: {
    ...context,
    session: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function TanstackRouterProvider() {
  const session = useSession()

  if (!session.isSessionReady) {
    return <LoadingSpinner />
  }

  return (
    <>
      <RouterProvider router={router} context={{ ...context, session }} />
    </>
  )
}
