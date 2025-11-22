import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import GlobalStyles from '@mui/joy/GlobalStyles'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import Chip from '@mui/joy/Chip'
import Divider from '@mui/joy/Divider'
import IconButton from '@mui/joy/IconButton'
import Input from '@mui/joy/Input'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'

import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import SupportRoundedIcon from '@mui/icons-material/SupportRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'

import { closeSidebar, getMenuByRole } from '../utils/sidebar.utils'
import ThemeSwitcher from './ThemeSwitcher'
import { useSession } from '@/features/session/hooks/useSession'

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean
  children: React.ReactNode
  renderToggle: (params: {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  }) => React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultExpanded)
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  )
}

export default function Sidebar() {
  const state = useRouterState()
  const currentPath = state.location.href // current full path

  const isActive = (path: string) => currentPath.startsWith(path)

  const session = useSession()
  const role = session.session?.roles[0]
  if (!role) throw new Error('Role is not provided')

  const menu = getMenuByRole(role)

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <SchoolRoundedIcon />
        </IconButton>
        <Typography level="title-lg">STEPS.EDU</Typography>
        <ThemeSwitcher sx={{ ml: 'auto' }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      />
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          {menu
            .filter((i) => !i.section)
            .map((item) => {
              const Icon = item.icon
              return (
                <ListItem
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{ textDecoration: 'none' }}
                >
                  <ListItemButton selected={isActive(item.path)}>
                    <Icon />
                    <ListItemContent>
                      <Typography level="title-sm">{item.label}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                </ListItem>
              )
            })}
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
          {menu
            .filter((i) => i.section === 'footer')
            .map((item) => {
              const Icon = item.icon
              return (
                <ListItem key={item.path} component={Link} to={item.path}>
                  <ListItemButton>
                    <Icon />
                    {item.label}
                  </ListItemButton>
                </ListItem>
              )
            })}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar variant="outlined" size="sm" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{session.session?.name}</Typography>
          <Typography level="body-xs">{session.session?.email}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  )
}
