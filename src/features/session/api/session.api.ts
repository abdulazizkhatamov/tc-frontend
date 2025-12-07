import type { SessionInterface } from '@/features/session/data/session.schema.ts'
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
  const response = await axiosInstance.post('/session/login', payload)
  return response.data
}

/* ============================================================
   🔹 POST - /session/logout
   ------------------------------------------------------------ */
export const postSessionLogout = async () => {
  const response = await axiosInstance.post('/session/logout')
  return response.data
}
