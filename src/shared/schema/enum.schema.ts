import z from 'zod'

// PRIORITY
export const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'], {
  message: 'Please select a priority',
})
export type PriorityType = z.infer<typeof priorityEnum>

// LEAD SOURCE
export const leadSourceEnum = z.enum(
  [
    'WALK_IN',
    'REFERRAL',
    'WEBSITE',
    'GOOGLE',
    'FACEBOOK',
    'INSTAGRAM',
    'OTHER',
  ],
  { message: 'Please select a lead source' },
)
export type LeadSourceType = z.infer<typeof leadSourceEnum>

// LEAD STATUS
export const leadStatusEnum = z.enum(
  ['NEW', 'CONTACTED', 'FOLLOW_UP', 'TRIAL', 'ENROLLED', 'LOST'],
  { message: 'Please select a lead status' },
)
export type LeadStatusType = z.infer<typeof leadStatusEnum>

// COURSE CATEGORY
export const courseCategoryEnum = z.enum(
  ['TECH', 'BUSINESS', 'LANGUAGE', 'OTHER'],
  { message: 'Please select a course category' },
)
export type CourseCategoryType = z.infer<typeof courseCategoryEnum>
