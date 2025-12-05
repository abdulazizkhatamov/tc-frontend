import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { postSessionLogin } from '../api/session.api'
import { getAxiosErrorMessage } from '@/shared/utils/axios.utils'

export const useSessionLogin = () =>
  useMutation({
    mutationFn: postSessionLogin,
    onSuccess: () => {
      window.location.href = '/'
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message, {
        position: 'top-center',
      })
    },
  })
