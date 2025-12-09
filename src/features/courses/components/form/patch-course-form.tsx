import React from 'react'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CoursesType } from '@/features/courses/data/schema'
import type { PatchCoursesPayload } from '@/features/courses/api/courses.api'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Spinner } from '@/shared/components/ui/spinner'
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
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { patchCourse } from '@/features/courses/api/courses.api'
import { courseCategoryEnum } from '@/shared/schema/enum.schema'
import { categories } from '@/features/courses/data/data'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'

interface IProps {
  course: CoursesType
}

const patchCourseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Enter a valid title'),
  description: z.string(),
  durationWeeks: z
    .number()
    .min(0, 'Duration must be greater than 0')
    .max(7, 'Duration must be less than 7.'),
  totalHours: z
    .number()
    .min(0, 'Total hours must be greater than 0')
    .max(24, 'Total hours must be less than 24.'),
  fee: z.number(),
  category: courseCategoryEnum,
  status: z.boolean(),
})

const PatchCourseForm: React.FC<IProps> = ({ course }) => {
  const queryClient = useQueryClient()
  const { mutate: mutatePatchCourse, isPending } = useMutation({
    mutationFn: patchCourse,
    onSuccess: async (_response) => {
      toast.success('Course updated successfully', { position: 'top-center' })
      await queryClient.invalidateQueries({ queryKey: ['course'] })
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
      id: course.id,
      title: course.title,
      description: course.description ?? '',
      durationWeeks: course.durationWeeks,
      totalHours: course.totalHours,
      fee: course.fee,
      category: course.category,
      status: course.status,
    },
    validators: { onSubmit: patchCourseSchema },
    onSubmit: ({ value }) => {
      const updatedFields: PatchCoursesPayload = { id: course.id }

      // Only send changed fields
      if (value.title !== course.title) updatedFields.title = value.title
      if (value.description !== course.description)
        updatedFields.description = value.description
      if (value.durationWeeks !== course.durationWeeks)
        updatedFields.durationWeeks = value.durationWeeks
      if (value.totalHours !== course.totalHours)
        updatedFields.totalHours = value.totalHours
      if (value.fee !== course.fee) updatedFields.fee = value.fee
      if (value.category !== course.category)
        updatedFields.category = value.category
      if (value.status !== course.status) updatedFields.status = value.status

      mutatePatchCourse(updatedFields)
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
          <FieldLegend>Update Course</FieldLegend>
          <FieldDescription>Update the details of this course</FieldDescription>

          <form.Field name="title">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="durationWeeks">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="durationWeeks">Duration Weeks</FieldLabel>
                <Input
                  id="durationWeeks"
                  type="number"
                  value={state.value}
                  onChange={(e) => handleChange(+e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="totalHours">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="totalHours">Total Hours</FieldLabel>
                <Input
                  id="totalHours"
                  type="number"
                  value={state.value}
                  onChange={(e) => handleChange(+e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="fee">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor="fee">Fee</FieldLabel>
                <Input
                  id="fee"
                  type="number"
                  value={state.value}
                  onChange={(e) => handleChange(+e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name="category">
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={state.value}
                  onValueChange={(val) =>
                    handleChange(val as typeof state.value)
                  }
                >
                  <SelectTrigger
                    className="w-[180px]"
                    onBlur={handleBlur}
                    aria-invalid={!state.meta.isValid}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map((option) => (
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

          <form.Field name="status">
            {({ state, handleChange }) => (
              <Field orientation="horizontal">
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
            {isPending ? <Spinner /> : 'Update Course'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default PatchCourseForm
