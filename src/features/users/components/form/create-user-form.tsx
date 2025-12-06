import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { IconCheck, IconPlus } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { postUsers } from '../../api/users.api'
import { Button } from '@/shared/components/ui/button'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Field as ShadcnField,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { Badge } from '@/shared/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/shared/components/ui/command'
import { cn } from '@/shared/lib/utils'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'

const createUserSchema = z.object({
  name: z.string().min(1, 'Enter a valid name'),
  email: z.email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters'),
  phone: z.string().or(z.literal('')),
  roles: z
    .array(z.enum(['ADMIN', 'STAFF', 'INSTRUCTOR']))
    .min(1, 'At least one role must be assigned'),
  status: z.boolean(),
})

const roleOptions = [
  { label: 'ADMIN', value: 'ADMIN' },
  { label: 'STAFF', value: 'STAFF' },
  { label: 'INSTRUCTOR', value: 'INSTRUCTOR' },
] as const

export default function CreateUserForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: createUser } = useMutation({
    mutationFn: postUsers,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate({ to: `/users/${response.id}` })
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      roles: [] as Array<'ADMIN' | 'STAFF' | 'INSTRUCTOR'>,
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
        handleSubmit()
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Create New User</FieldLegend>
          <FieldDescription>
            Fill in the details to add a new user
          </FieldDescription>

          <Field name="name">
            {({ state, handleChange, handleBlur }) => (
              <ShadcnField data-invalid={!state.meta.isValid}>
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
              </ShadcnField>
            )}
          </Field>

          <Field name="email">
            {({ state, handleChange, handleBlur }) => (
              <ShadcnField data-invalid={!state.meta.isValid}>
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
              </ShadcnField>
            )}
          </Field>

          <Field name="password">
            {({ state, handleChange, handleBlur }) => (
              <ShadcnField data-invalid={!state.meta.isValid}>
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
          </Field>

          <Field name="phone">
            {({ state, handleChange, handleBlur }) => (
              <ShadcnField data-invalid={!state.meta.isValid}>
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
              </ShadcnField>
            )}
          </Field>

          <Field name="roles">
            {({ state, handleChange }) => {
              const selectedValues = new Set(state.value)

              return (
                <ShadcnField data-invalid={!state.meta.isValid}>
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
                </ShadcnField>
              )
            }}
          </Field>

          <Field name="status">
            {({ state, handleChange }) => (
              <ShadcnField orientation={'horizontal'}>
                <FieldLabel>Status</FieldLabel>
                <Switch
                  checked={state.value}
                  onCheckedChange={(val) => handleChange(val)}
                />
              </ShadcnField>
            )}
          </Field>
        </FieldSet>

        <FieldSeparator />

        <ShadcnField orientation="vertical">
          <Button type="submit">Create User</Button>
        </ShadcnField>
      </FieldGroup>
    </form>
  )
}
