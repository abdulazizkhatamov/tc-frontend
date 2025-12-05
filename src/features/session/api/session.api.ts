import type { SessionInterface } from '@/features/session/schema/session.schema'
import axiosInstance from '@/config/axios.config'

// INTERFACES
interface SessionLoginPayload {
  email: string
  password: string
}

/* ============================================================
   🔹 GET - /session
   ------------------------------------------------------------ */
export const getSession = async () => {
  const res = await axiosInstance.get('/session')
  return res.data as SessionInterface
}

/* ============================================================
   🔹 POST - /session/login
   ------------------------------------------------------------ */
export const postSessionLogin = async (payload: SessionLoginPayload) => {
  const { data } = await axiosInstance.post('/session/login', payload)
  return data
}
