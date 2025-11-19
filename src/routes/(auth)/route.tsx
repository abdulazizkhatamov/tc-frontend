import CssBaseline from '@mui/material/CssBaseline'
import { styled } from '@mui/material/styles'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import Stack from '@mui/material/Stack'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.session.session) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <AuthContainer direction="column" justifyContent={'space-between'}>
        <Outlet />
      </AuthContainer>
    </>
  )
}

const AuthContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))
