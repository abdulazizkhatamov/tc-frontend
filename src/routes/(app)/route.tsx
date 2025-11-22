import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Breadcrumbs from '@mui/joy/Breadcrumbs'
import Link from '@mui/joy/Link'
import Typography from '@mui/joy/Typography'

import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'

import {
  Outlet,
  Link as RouterLink,
  createFileRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import Header from '@/shared/components/Header'
import Sidebar from '@/shared/components/Sidebar'
import { createBreadcrumbs } from '@/shared/utils/breadcrumb.utils'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session.session) {
      throw redirect({ to: '/login' })
    }
  },
})

function RouteComponent() {
  const { location } = useRouterState()

  const breadcrumbs = createBreadcrumbs(location.pathname)
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              {/* Home icon always links to /app */}
              <Link
                underline="none"
                color="neutral"
                component={RouterLink}
                to="/app"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>

              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                return isLast ? (
                  <Typography
                    key={crumb.to}
                    color="primary"
                    sx={{ fontWeight: 500, fontSize: 12 }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.to}
                    underline="hover"
                    color="neutral"
                    component={RouterLink}
                    to={crumb.to}
                    sx={{ fontSize: 12, fontWeight: 500 }}
                  >
                    {crumb.label}
                  </Link>
                )
              })}
            </Breadcrumbs>
          </Box>
          <Outlet />
        </Box>
      </Box>
    </CssVarsProvider>
  )
}
