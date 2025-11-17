import { useQuery } from '@tanstack/react-query'
import type { SessionInterface } from '../schema/session.schema'
import axiosInstance from '@/config/axios.config'

/* ============================================================
   🔹 Session Query Hook
   ------------------------------------------------------------ */
export function useSession() {
  return useQuery<SessionInterface>({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/session')
      return data
    },
  })
}
