import { redirect } from '@tanstack/react-router'

export function requireRole(userRoles: Array<string> = [], allowedRoles: Array<string>) {
  const hasAccess = allowedRoles.some((role) => userRoles.includes(role))
  if (!hasAccess) {
    throw redirect({ to: '/403' }) // user exists but not allowed
  }
}
