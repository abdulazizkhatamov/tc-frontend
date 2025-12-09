import z from 'zod'
import type { Filters } from '@/shared/types/api.type'
import { courseCategoryEnum } from '@/shared/schema/enum.schema.ts'

export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  durationWeeks: z.number(),
  totalHours: z.number(),
  fee: z.number(),
  category: courseCategoryEnum,
  syllabus: z.array(z.string()),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CoursesType = z.infer<typeof courseSchema>
export type CoursesFiltersType = Filters<CoursesType>
