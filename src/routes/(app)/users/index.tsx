import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Box, Sheet, Table, Typography } from '@mui/joy'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { userColumns } from '@/features/users/columns'
import { useUsersQuery } from '@/features/users/hooks/useUsersQuery'

export const Route = createFileRoute('/(app)/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useUsersQuery()

  const table = useReactTable({
    columns: userColumns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2" component="h1">
          Users
        </Typography>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground':
              'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground':
              'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <th
                      style={{
                        width: 48,
                        padding: '12px 6px',
                      }}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <Typography level="body-xs">No results.</Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>
      {/* <OrderTable /> */}
      {/* <OrderList /> */}
    </React.Fragment>
  )
}
