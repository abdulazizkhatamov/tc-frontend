import z from 'zod'
import type { Filters } from '@/shared/types/api.type'
import {
  leadSourceEnum,
  leadStatusEnum,
  priorityEnum,
} from '@/shared/schema/enum.schema.ts'
import { courseSchema } from '@/features/courses/data/schema.ts'
import { userSchema } from '@/features/users/data/schema.ts'

export const leadSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  source: leadSourceEnum,
  status: leadStatusEnum,
  priority: priorityEnum,
  interestedCourses: z.array(courseSchema),
  userId: z.string(),
  assignedTo: userSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type LeadsType = z.infer<typeof leadSchema>
export type LeadsFiltersType = Filters<LeadsType>
