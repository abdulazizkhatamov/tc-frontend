import z from 'zod'

import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/components/ui/button'
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field as ShadcnField,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { useSessionLogin } from '@/features/session/hooks/useSessionLogin'
import { Spinner } from '@/shared/components/ui/spinner'

export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters'),
})

export function LoginForm() {
  const { mutate: login, isPending } = useSessionLogin()
  const { Field, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: ({ value }) => {
      login(value)
    },
    validators: { onChange: loginSchema },
  })

  return (
    <form
      onClick={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <FieldGroup>
        <Field
          name="email"
          children={({ state, handleChange, handleBlur }) => (
            <ShadcnField
              orientation={'responsive'}
              data-invalid={!state.meta.isValid}
            >
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                aria-invalid={!state.meta.isValid}
              />
              <FieldError errors={state.meta.errors} />
            </ShadcnField>
          )}
        />
        <Field
          name="password"
          children={({ state, handleChange, handleBlur }) => (
            <ShadcnField
              orientation={'responsive'}
              data-invalid={!state.meta.isValid}
            >
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="**********"
                value={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                aria-invalid={!state.meta.isValid}
              />
              <FieldError errors={state.meta.errors} />
            </ShadcnField>
          )}
        />
        <ShadcnField orientation={'responsive'}>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Login'}
          </Button>
        </ShadcnField>
      </FieldGroup>
    </form>
  )
}
