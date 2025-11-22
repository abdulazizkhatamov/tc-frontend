import { createColumnHelper } from '@tanstack/react-table'
import { Box, Chip, Stack } from '@mui/joy'
import type { UserType } from './schema/user.schema'

const columnHelper = createColumnHelper<UserType>()

export const userColumns = [
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: () => 'Full name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.roles, {
    id: 'roles',
    header: () => 'Role',
    cell: (info) => (
      <Stack gap={1} flexDirection={'row'}>
        {info.getValue().map((role) => (
          <Chip
            color={role === 'STAFF' ? 'primary' : 'success'}
            size="sm"
            variant="soft"
          >
            {role}
          </Chip>
        ))}
      </Stack>
    ),
  }),
]
