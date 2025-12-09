import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { postUsers } from '../../api/users.api'
import { Button } from '@/shared/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'
import { Spinner } from '@/shared/components/ui/spinner.tsx'
import { DebouncedSelect } from '@/shared/components/ui/debounced-select.tsx'
import { roleOptions } from '@/features/users/data/roles.ts'

const createUserSchema = z.object({
  name: z.string().min(1, 'Enter a valid name'),
  email: z.email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters'),
  phone: z.string().or(z.literal('')),
  roles: z.array(z.string()).min(1, 'At least one role must be assigned'),
  status: z.boolean(),
})

export default function CreateUserForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: createUser, isPending } = useMutation({
    mutationFn: postUsers,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await navigate({ to: `/users/${response.id}` })
    },
    onError: (error) => {
      const msg = getAxiosErrorMessage(error)

      toast.error(<div style={{ whiteSpace: 'pre-line' }}>{msg}</div>, {
        position: 'top-center',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      roles: [] as Array<string>,
      status: true,
    },
    validators: { onSubmit: createUserSchema },
    onSubmit: ({ value }) => {
      createUser(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create New User</FieldLegend>
          <FieldDescription>
            Fill in the details to add a new user
          </FieldDescription>

          <form.Field name="name">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="email">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
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
              </Field>
            )}
          </form.Field>

          <form.Field name="phone">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                <Input
                  id="phone"
                  placeholder="+1 555 123 4567"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="roles">
            {({ state, handleChange }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel>Roles</FieldLabel>

                <DebouncedSelect
                  value={state.value}
                  onChange={(value) => handleChange(value as Array<string>)}
                  options={roleOptions}
                  multiple
                  debounceSearch
                  placeholder="Select Roles"
                />

                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="status">
            {({ state, handleChange }) => (
              <Field orientation={'horizontal'}>
                <FieldLabel>Status</FieldLabel>
                <Switch
                  checked={state.value}
                  onCheckedChange={(val) => handleChange(val)}
                />
              </Field>
            )}
          </form.Field>
        </FieldSet>

        <FieldSeparator />

        <Field orientation="vertical">
          <Button type="submit">
            {isPending ? <Spinner /> : 'Create User'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
