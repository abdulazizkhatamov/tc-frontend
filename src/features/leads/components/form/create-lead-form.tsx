import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import type {
  LeadSourceType,
  LeadStatusType,
  PriorityType,
} from '@/shared/schema/enum.schema.ts'
import { postLeads } from '@/features/leads/api/leads.api.ts'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'
import {
  leadSourceEnum,
  leadStatusEnum,
  priorityEnum,
} from '@/shared/schema/enum.schema.ts'
import { priorities, sources, statuses } from '@/features/leads/data/data.tsx'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner.tsx'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx'
import { DebouncedSelect } from '@/shared/components/ui/debounced-select.tsx'
import { getCourses } from '@/features/courses/api/courses.api.ts'

const createLeadSchema = z.object({
  fullName: z.string().min(1, 'Enter a valid name'),
  email: z.email('Enter a valid email'),
  phone: z.string().or(z.literal('')),
  source: leadSourceEnum,
  status: leadStatusEnum,
  priority: priorityEnum,
  userId: z.string(),
  interestedCourses: z.array(z.string()).min(1, 'Select at least one course'),
})

interface Props {
  userId: string
}

export default function CreateLeadForm({ userId }: Props) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: postLeads,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
      await navigate({ to: `/leads/${response.id}` })
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
      fullName: '',
      email: '',
      phone: '',
      source: '' as LeadSourceType,
      status: '' as LeadStatusType,
      priority: '' as PriorityType,
      userId: userId,
      interestedCourses: [] as Array<string>,
    },
    validators: { onSubmit: createLeadSchema },
    onSubmit: ({ value }) => {
      mutate(value)
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
          <FieldLegend>Create New Lead</FieldLegend>
          <FieldDescription>
            Fill in the details to add a new lead
          </FieldDescription>

          <InputField
            form={form}
            name="fullName"
            label="Full name"
            placeholder="John Doe"
          />
          <InputField
            form={form}
            name="email"
            label="Email"
            placeholder="email@example.com"
            type="email"
          />
          <InputField
            form={form}
            name="phone"
            label="Phone (optional)"
            placeholder="+1 555 123 4567"
          />

          <SelectField
            form={form}
            name="source"
            label="Lead source"
            options={sources}
          />
          <SelectField
            form={form}
            name="status"
            label="Lead status"
            options={statuses}
          />
          <SelectField
            form={form}
            name="priority"
            label="Lead priority"
            options={priorities}
          />

          <form.Field name="interestedCourses">
            {({ state, handleChange }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel>Courses</FieldLabel>

                <DebouncedSelect
                  value={state.value}
                  onChange={(value) =>
                    handleChange(() => value as Array<string>)
                  }
                  loadOptions={async (query) => {
                    const data = await getCourses({ title: query })
                    return data.result.map((course) => ({
                      label: course.title,
                      value: course.id,
                    }))
                  }}
                  multiple
                  debounce={1000}
                  debounceSearch
                  placeholder="Select Courses"
                />

                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>
        </FieldSet>

        <FieldSeparator />

        <Field orientation="vertical">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : 'Create Lead'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

const InputField = ({ form, name, label, placeholder, type = 'text' }: any) => (
  <form.Field name={name}>
    {({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handleChange,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handleBlur,
    }) => (
      <Field data-invalid={!state.meta.isValid}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          value={state.value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          aria-invalid={!state.meta.isValid}
        />
        <FieldError errors={state.meta.errors} />
      </Field>
    )}
  </form.Field>
)

// Reusable select field component
const SelectField = ({ form, name, label, options }: any) => (
  <form.Field name={name}>
    {({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handleChange,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      handleBlur,
    }) => (
      <Field data-invalid={!state.meta.isValid}>
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
        <Select onValueChange={(value) => handleChange(value)}>
          <SelectTrigger
            className="w-[180px]"
            onBlur={handleBlur}
            aria-invalid={!state.meta.isValid}
          >
            <SelectValue placeholder={`Select a ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options.map((option: any) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError errors={state.meta.errors} />
      </Field>
    )}
  </form.Field>
)
