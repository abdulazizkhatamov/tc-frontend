export function createBreadcrumbs(path: string) {
  const parts = path.split('/').filter(Boolean)

  const crumbs = []
  let current = ''

  for (const part of parts) {
    current += '/' + part
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      to: current,
    })
  }

  return crumbs
}
