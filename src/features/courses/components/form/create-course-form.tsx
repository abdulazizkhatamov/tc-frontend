import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'

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

import { postCourses } from '@/features/courses/api/courses.api.ts'
import { categories } from '@/features/courses/data/data.tsx'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { Switch } from '@/shared/components/ui/switch.tsx'
import { courseCategoryEnum } from '@/shared/schema/enum.schema.ts'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select.tsx'

const createCourseSchema = z.object({
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

// Reusable input field component

export default function CreateCourseForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: postCourses,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
      await navigate({ to: `/courses/${response.id}` })
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
      title: '',
      description: '',
      durationWeeks: 0,
      totalHours: 0,
      fee: 0,
      category: '',
      status: true,
    },
    validators: { onSubmit: createCourseSchema },
    onSubmit: ({ value }) => createCourse(value),
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
          <FieldLegend>Create New Course</FieldLegend>
          <FieldDescription>
            Fill in the details to add a new course
          </FieldDescription>

          <form.Field name={'title'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'title'}>Title</FieldLabel>
                <Input
                  id={'title'}
                  type={'text'}
                  placeholder={'Course #1'}
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name={'description'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'description'}>Description</FieldLabel>
                <Textarea
                  id={'description'}
                  placeholder="Something about this course...."
                  value={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name={'durationWeeks'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'durationWeeks'}>
                  Duration weeks
                </FieldLabel>
                <Input
                  id={'durationWeeks'}
                  type={'number'}
                  placeholder={'0-7'}
                  value={state.value}
                  onChange={(e) => handleChange(+e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name={'totalHours'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'totalHours'}>Total hours</FieldLabel>
                <Input
                  id={'totalHours'}
                  type={'number'}
                  placeholder={'0-24'}
                  value={state.value}
                  onChange={(e) => handleChange(+e.target.value)}
                  onBlur={handleBlur}
                  aria-invalid={!state.meta.isValid}
                />
                <FieldError errors={state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <form.Field name={'fee'}>
            {({ state, handleChange, handleBlur }) => (
              <Field data-invalid={!state.meta.isValid}>
                <FieldLabel htmlFor={'fee'}>Fee</FieldLabel>
                <Input
                  id={'fee'}
                  type={'number'}
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
                <Select onValueChange={(value) => handleChange(value)}>
                  <SelectTrigger
                    className="w-[180px]"
                    onBlur={handleBlur}
                    aria-invalid={!state.meta.isValid}
                  >
                    <SelectValue placeholder={`Select a category`} />
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
            {isPending ? <Spinner /> : 'Create Course'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
