import { IconDots } from '@tabler/icons-react'

import { Link } from '@tanstack/react-router'
import { userSchema } from '../../data/schema'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

interface TableRowActionsProps<TData> {
  row: Row<TData>
}

export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
  const user = userSchema.parse(row.original)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <IconDots />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link to={'/users/$id/edit'} params={{ id: user.id }}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
