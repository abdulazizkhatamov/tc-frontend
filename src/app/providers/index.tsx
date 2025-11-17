import MuiProvider from './mui.provider'
import ReduxStoreProvider from './redux.provider'
import TanstackRouterProvider from './router.provider'

import TanstackQueryProvider, {
  getContext as getTanstackQueryContext,
} from '@/app/providers/query.provider'

const TanStackQueryProviderContext = getTanstackQueryContext()

export default function Providers() {
  return (
    <ReduxStoreProvider>
      <TanstackQueryProvider {...TanStackQueryProviderContext}>
        <MuiProvider>
          <TanstackRouterProvider />
        </MuiProvider>
      </TanstackQueryProvider>
    </ReduxStoreProvider>
  )
}
