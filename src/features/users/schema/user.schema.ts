// model User {
//   id        String     @id @default(cuid()) // Unique ID for the user
//   name      String // Full name
//   email     String     @unique // Unique email for login
//   phone     String? // Optional phone number
//   roles     UserRole[] // Role of user
//   password  String // Hashed password
//   isActive  Boolean    @default(true) // Active status
//   createdAt DateTime   @default(now()) // Creation timestamp
//   updatedAt DateTime   @updatedAt // Last updated timestamp

//   // Relations
//   leads             Lead[] // Leads assigned to the user
//   batches           Batch[] // Batches the user is instructing
//   payments          Payment[] // Payments recorded by the user
//   leadNotes         LeadNote[] // Notes authored by the user
//   messageTemplates  MessageTemplate[] // Message templates created by user
//   attendanceRecords AttendanceRecord[] // Attendance records taken by user
// }

import z from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  roles: z.array(z.enum(['ADMIN', 'STAFF', 'INSTRUCTOR'])),
  password: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type UserType = z.infer<typeof userSchema>
