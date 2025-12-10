import React from 'react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner' // Define the type for props (if any)
import type { UsersType } from '@/features/users/data/schema.ts'
import type { PatchUsersPayload } from '@/features/users/api/users.api.ts'
import type { RoleType } from '@/shared/schema/enum.schema.ts' // Define the type for props (if any)
import { roleEnum } from '@/shared/schema/enum.schema.ts'
import { patchUser } from '@/features/users/api/users.api.ts'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/shared/components/ui/field.tsx'
import { Input } from '@/shared/components/ui/input.tsx'
import { Button } from '@/shared/components/ui/button.tsx'

import { Switch } from '@/shared/components/ui/switch.tsx'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils.ts'
import { Spinner } from '@/shared/components/ui/spinner.tsx'
import { DebouncedSelect } from '@/shared/components/ui/debounced-select.tsx'
import { roles } from '@/features/users/data/data.tsx'

// Define the type for props (if any)
interface Props {
  user: UsersType
}

const patchUserSchema = z.object({
  id: z.string(),
  name: z.string('Enter a valid name'),
  email: z.email('Enter a valid email'),
  phone: z.string().or(z.literal('')),
  roles: z.array(roleEnum).min(1, 'At least one role must be assigned'),
  status: z.boolean(),
})

// Functional component using TypeScript
const PatchUserForm: React.FC<Props> = ({ user }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      toast.info('Successfully updated user', { position: 'top-center' })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      roles: user.roles,
      status: user.status,
    },
    validators: {
      onSubmit: patchUserSchema,
    },
    onSubmit: ({ value }) => {
      const updatedFields: PatchUsersPayload = { id: user.id }

      const normalizePhone = (p: string | undefined | null) =>
        p === '' ? null : p

      // --- name ---
      if (value.name !== user.name) {
        updatedFields.name = value.name
      }

      // --- email ---
      if (value.email !== user.email) {
        updatedFields.email = value.email
      }

      // --- phone ('' -> null) ---
      const nextPhone = normalizePhone(value.phone)
      const prevPhone = normalizePhone(user.phone)

      if (nextPhone !== prevPhone) {
        // if nextPhone is null, omit undefined and explicitly set null
        updatedFields.phone = nextPhone === null ? null : nextPhone
      }

      // --- roles (deep equality using set-like comparison) ---
      const rolesEqual =
        value.roles.length === user.roles.length &&
        value.roles.every((r) => user.roles.includes(r))

      if (!rolesEqual) {
        updatedFields.roles = value.roles
      }

      // --- status (boolean compare) ---
      if (value.status !== user.status) {
        updatedFields.status = value.status
      }

      mutate(updatedFields)
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
          <FieldLegend>Update User Data</FieldLegend>
          <FieldDescription>
            Fill in the details to update a existing user
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
            {({ state, handleChange }) => {
              return (
                <Field data-invalid={!state.meta.isValid}>
                  <FieldLabel>Roles</FieldLabel>
                  <DebouncedSelect
                    value={state.value}
                    onChange={(value) =>
                      handleChange(() => value as Array<RoleType>)
                    }
                    options={roles}
                    multiple
                    debounceSearch
                    placeholder="Select Roles"
                  />
                  <FieldError errors={state.meta.errors} />
                </Field>
              )
            }}
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
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Update User'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default PatchUserForm
