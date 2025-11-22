import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import ConnectWithoutContactRoundedIcon from '@mui/icons-material/ConnectWithoutContactRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import CastForEducationRoundedIcon from '@mui/icons-material/CastForEducationRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'

// ---- STATIC MENU CONFIG ----

export const sidebarMenu = [
  {
    label: 'Users',
    icon: GroupRoundedIcon,
    path: '/users',
    roles: ['ADMIN'],
  },
  {
    label: 'Leads',
    icon: ConnectWithoutContactRoundedIcon,
    path: '/leads',
    roles: ['ADMIN', 'STAFF', 'INSTRUCTOR'],
  },
  {
    label: 'Students',
    icon: SchoolRoundedIcon,
    path: '/students',
    roles: ['ADMIN', 'STAFF', 'INSTRUCTOR'],
  },
  {
    label: 'Courses',
    icon: CastForEducationRoundedIcon,
    path: '/courses',
    roles: ['ADMIN', 'STAFF', 'INSTRUCTOR'],
  },
  {
    section: 'footer',
    label: 'Support',
    icon: SupportRoundedIcon,
    path: '/support',
    roles: ['ADMIN', 'STAFF', 'INSTRUCTOR'],
  },
  {
    section: 'footer',
    label: 'Settings',
    icon: SettingsRoundedIcon,
    path: '/settings',
    roles: ['ADMIN', 'STAFF', 'INSTRUCTOR'],
  },
]

export const getMenuByRole = (role: string) =>
  sidebarMenu.filter((item) => item.roles.includes(role))

export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1')
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn')
    document.body.style.removeProperty('overflow')
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn')
    if (slideIn) {
      closeSidebar()
    } else {
      openSidebar()
    }
  }
}
