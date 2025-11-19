import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axiosInstance from '@/config/axios.config'
import { getAxiosErrorMessage } from '@/core/errors/axios.error'

/* ============================================================
   🔹 Session Mutation
   ------------------------------------------------------------ */
interface LoginPayload {
  email: string
  password: string
}

export const useSessionLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post('/session/login', payload)
      return data
    },
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
}
