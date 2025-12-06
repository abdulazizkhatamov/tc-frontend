import z from 'zod'
import type { Filters } from '@/shared/types/api.type'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  roles: z.array(z.enum(['ADMIN', 'STAFF', 'INSTRUCTOR'])),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type UsersType = z.infer<typeof userSchema>
export type UsersFiltersType = Filters<UsersType>
