import { IconCheck, IconX } from '@tabler/icons-react'

export const roles = [
  {
    value: 'ADMIN',
    label: 'Admin',
  },
  {
    value: 'STAFF',
    label: 'Staff',
  },
  {
    value: 'INSTRUCTOR',
    label: 'Instructor',
  },
]

export const statuses = [
  {
    value: true,
    label: 'Active',
    icon: IconCheck,
  },
  {
    value: false,
    label: 'Inactive',
    icon: IconX,
  },
]
