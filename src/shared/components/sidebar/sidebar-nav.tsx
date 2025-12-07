import { Link } from '@tanstack/react-router'
import type { Icon } from '@tabler/icons-react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar'
import { useSession } from '@/features/session/hooks/use-session.ts'

export function SidebarNavMain({
  items,
}: {
  items: Array<{
    title: string
    url: string
    icon?: Icon
    roles?: Array<string> // <-- add this
  }>
}) {
  const { session } = useSession()
  const userRoles = session?.roles ?? []

  const canShow = (itemRoles?: Array<string>) => {
    // If no role restrictions → allow everyone
    if (!itemRoles || itemRoles.length === 0) return true
    return itemRoles.some((role) => userRoles.includes(role))
  }

  const filteredItems = items.filter((item) => canShow(item.roles))

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {filteredItems.map((item) => (
            <Link to={item.url} key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
