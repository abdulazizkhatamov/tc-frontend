import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import type { BackdropProps } from '@mui/material/Backdrop'
import type { CircularProgressProps } from '@mui/material/CircularProgress'
import type { FC } from 'react'

interface LoadingBackdropProps {
  open: boolean
  color?: CircularProgressProps['color']
  backdropProps?: Omit<BackdropProps, 'open'>
  circularProps?: CircularProgressProps
}

const LoadingBackdrop: FC<LoadingBackdropProps> = ({
  open,
  color = 'inherit',
  backdropProps = {},
  circularProps = {},
}) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={open}
      {...backdropProps}
    >
      <CircularProgress color={color} {...circularProps} />
    </Backdrop>
  )
}

export default LoadingBackdrop
