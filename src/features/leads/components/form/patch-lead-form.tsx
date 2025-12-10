import React from 'react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner' // Define the type for props (if any)
import type { LeadsType } from '@/features/leads/data/schema.ts' // Define the type for props (if any)
import type { PatchLeadsPayload } from '@/features/leads/api/leads.api.ts'
import type {
  LeadSourceType,
  LeadStatusType,
  PriorityType,
} from '@/shared/schema/enum.schema.ts'
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

import { getAxiosErrorMessage } from '@/shared/utils/axios.utils.ts'
import { Spinner } from '@/shared/components/ui/spinner.tsx'
import { patchLead } from '@/features/leads/api/leads.api.ts'
import {
  leadSourceEnum,
  leadStatusEnum,
  priorityEnum,
} from '@/shared/schema/enum.schema.ts'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx'
import { priorities, sources, statuses } from '@/features/leads/data/data.tsx'
import { DebouncedSelect } from '@/shared/components/ui/debounced-select.tsx'
import { getCourses } from '@/features/courses/api/courses.api.ts'

// Define the type for props (if any)
interface IProps {
  lead: LeadsType
}

const patchLeadSchema = z.object({
  id: z.string(),
  fullName: z.string('Enter a valid full name'),
  phone: z.string().or(z.literal('')),
  source: leadSourceEnum,
  status: leadStatusEnum,
  priority: priorityEnum,
  userId: z.string(),
  interestedCourses: z
    .array(z.string())
    .min(1, 'At least one course must be selected'),
})

// Functional component using TypeScript
const PatchLeadForm: React.FC<IProps> = ({ lead }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: patchLead,
    onSuccess: () => {
      toast.info('Successfully updated lead', { position: 'top-center' })
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
      id: lead.id,
      fullName: lead.fullName,
      phone: lead.phone ?? '',
      source: lead.source,
      status: lead.status,
      priority: lead.priority,
      userId: lead.assignedTo.id,
      interestedCourses: lead.interestedCourses.map((course) => course.id),
    },
    validators: {
      onSubmit: patchLeadSchema,
    },
    onSubmit: ({ value }) => {
      const updatedFields: PatchLeadsPayload = { id: lead.id }

      const normalizePhone = (p: string | undefined | null) =>
        p === '' ? null : p

      // --- fullName ---
      if (value.fullName !== lead.fullName) {
        updatedFields.fullName = value.fullName
      }

      // --- phone ('' -> null) ---
      const nextPhone = normalizePhone(value.phone)
      const prevPhone = normalizePhone(lead.phone)

      if (nextPhone !== prevPhone) {
        // if nextPhone is null, omit undefined and explicitly set null
        updatedFields.phone = nextPhone === null ? null : nextPhone
      }

      // --- source ---
      if (value.source !== lead.source) {
        updatedFields.source = value.source
      }

      // --- status ---
      if (value.status !== lead.status) {
        updatedFields.status = value.status
      }

      // --- status ---
      if (value.priority !== lead.priority) {
        updatedFields.priority = value.priority
      }

      const existingCourses = lead.interestedCourses.map((c) => c.id)

      const sameCourses =
        existingCourses.length === value.interestedCourses.length &&
        value.interestedCourses.every((id) => existingCourses.includes(id))

      if (!sameCourses) {
        updatedFields.interestedCourses = value.interestedCourses
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
          <FieldLegend>Update Lead Data</FieldLegend>
          <FieldDescription>
            Fill in the details to update a existing lead
          </FieldDescription>

          <form.Field name="fullName">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                <Input
                  id="fullName"
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

          <form.Field name={'source'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'source'}>Source</FieldLabel>
                <Select
                  onValueChange={(value) =>
                    handleChange(value as LeadSourceType)
                  }
                  value={state.value}
                >
                  <SelectTrigger
                    className="w-[180px]"
                    onBlur={handleBlur}
                    aria-invalid={!state.meta.isValid}
                  >
                    <SelectValue placeholder={`Select a source`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a role</SelectLabel>
                      {sources.map((option) => (
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

          <form.Field name={'status'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'status'}>Status</FieldLabel>
                <Select
                  onValueChange={(value) =>
                    handleChange(value as LeadStatusType)
                  }
                  value={state.value}
                >
                  <SelectTrigger
                    className="w-[180px]"
                    onBlur={handleBlur}
                    aria-invalid={!state.meta.isValid}
                  >
                    <SelectValue placeholder={`Select a status`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a status</SelectLabel>
                      {statuses.map((option) => (
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

          <form.Field name={'priority'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'priority'}>Priority</FieldLabel>
                <Select
                  onValueChange={(value) => handleChange(value as PriorityType)}
                  value={state.value}
                >
                  <SelectTrigger
                    className="w-[180px]"
                    onBlur={handleBlur}
                    aria-invalid={!state.meta.isValid}
                  >
                    <SelectValue placeholder={`Select a priority`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a priority</SelectLabel>
                      {priorities.map((option) => (
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
            {isPending ? <Spinner /> : 'Update User'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default PatchLeadForm
