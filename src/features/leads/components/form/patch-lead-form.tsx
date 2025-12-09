import React from 'react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { IconCheck, IconPlus } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner' // Define the type for props (if any)
import type { UsersType } from '@/features/users/data/schema.ts'
import type { PatchUsersPayload } from '@/features/users/api/users.api.ts'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { Badge } from '@/shared/components/ui/badge.tsx'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/shared/components/ui/command.tsx'
import { cn } from '@/shared/lib/utils.ts'
import { Switch } from '@/shared/components/ui/switch.tsx'
import { roleOptions } from '@/features/users/data/roles.ts'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils.ts'
import { Spinner } from '@/shared/components/ui/spinner.tsx' // Define the type for props (if any)

// Define the type for props (if any)
interface IProps {
  user: UsersType
}

const patchUserSchema = z.object({
  id: z.string(),
  name: z.string('Enter a valid name'),
  email: z.email('Enter a valid email'),
  phone: z.string().or(z.literal('')),
  roles: z
    .array(z.enum(['ADMIN', 'STAFF', 'INSTRUCTOR']))
    .min(1, 'At least one role must be assigned'),
  status: z.boolean(),
})

// Functional component using TypeScript
const PatchLeadForm: React.FC<IProps> = ({ user }) => {
  const { mutate: mutatePatchUser, isPending } = useMutation({
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

      mutatePatchUser(updatedFields)
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
              const selectedValues = new Set(state.value)

              return (
                <Field data-invalid={!state.meta.isValid}>
                  <FieldLabel>Roles</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed"
                      >
                        <IconPlus />
                        Select Roles
                        {selectedValues.size > 0 && (
                          <>
                            <div className="hidden space-x-1 lg:flex">
                              {selectedValues.size > 2 ? (
                                <Badge variant="secondary">
                                  {selectedValues.size} selected
                                </Badge>
                              ) : (
                                roleOptions
                                  .filter((option) =>
                                    selectedValues.has(option.value),
                                  )
                                  .map((option) => (
                                    <Badge
                                      key={option.value}
                                      variant="secondary"
                                    >
                                      {option.label}
                                    </Badge>
                                  ))
                              )}
                            </div>
                          </>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search roles..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            {roleOptions.map((option) => {
                              const isSelected = selectedValues.has(
                                option.value,
                              )
                              return (
                                <CommandItem
                                  key={option.value}
                                  onSelect={() => {
                                    if (isSelected) {
                                      selectedValues.delete(option.value)
                                    } else {
                                      selectedValues.add(option.value)
                                    }
                                    handleChange(Array.from(selectedValues))
                                  }}
                                >
                                  <div
                                    className={cn(
                                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                      isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'opacity-50 [&_svg]:invisible',
                                    )}
                                  >
                                    <IconCheck />
                                  </div>
                                  <span>{option.label}</span>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                          {selectedValues.size > 0 && (
                            <>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => handleChange([])}
                                  className="justify-center text-center"
                                >
                                  Clear selections
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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

export default PatchLeadForm
