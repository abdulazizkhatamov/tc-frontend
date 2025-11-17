import { ThemeProvider } from '@mui/material'
import type React from 'react'
import theme from '@/shared/theme'

interface MuiProviderProps {
  children: React.ReactNode
}

export default function MuiProvider({ children }: MuiProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
