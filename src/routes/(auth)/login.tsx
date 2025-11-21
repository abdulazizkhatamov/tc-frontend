import MuiCard from '@mui/joy/Card'
import { styled } from '@mui/joy/styles'
import Box from '@mui/joy/Box'
import { createFileRoute } from '@tanstack/react-router'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import Button from '@mui/joy/Button'
import { useForm } from '@tanstack/react-form'
import z from 'zod'
import Input from '@mui/joy/Input'
import Typography from '@mui/joy/Typography'
import FormHelperText from '@mui/joy/FormHelperText'
import { useSessionLogin } from '@/shared/api/session.api'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters'),
})

function RouteComponent() {
  const { mutate: login, isPending } = useSessionLogin()

  const { Field, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: ({ value }) => {
      login(value)
    },
    validators: { onChange: loginSchema },
  })

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          marginTop: 2,
        }}
      >
        <Field
          name="email"
          children={({ state, handleChange, handleBlur }) => (
            <FormControl error={!state.meta.isValid}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                fullWidth
                variant="outlined"
                error={!state.meta.isValid}
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
              />
              <FormHelperText>{state.meta.errors[0]?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Field
          name="password"
          children={({ state, handleChange, handleBlur }) => (
            <FormControl error={!state.meta.isValid}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                fullWidth
                variant="outlined"
                error={!state.meta.isValid}
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
              />
              <FormHelperText>{state.meta.errors[0]?.message}</FormHelperText>
            </FormControl>
          )}
        />

        <Button type="submit" fullWidth variant="solid" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </Box>
    </Card>
  )
}

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))
