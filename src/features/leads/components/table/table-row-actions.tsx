import { IconDots } from '@tabler/icons-react'

import { Link } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { leadSchema } from '@/features/leads/data/schema.ts'

interface TableRowActionsProps<TData> {
  row: Row<TData>
}

export function TableRowActions<TData>({ row }: TableRowActionsProps<TData>) {
  const lead = leadSchema.parse(row.original)

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
        <Link to={'/leads/$id/edit'} params={{ id: lead.id }}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
