import type { UserType } from '../schema/user.schema'
import axiosInstance from '@/config/axios.config'

/* ============================================================
   🔹 GET - /users
   ------------------------------------------------------------ */
export const getUsers = async () => {
  const { data } = await axiosInstance.get<Array<UserType>>('/users')
  return data
}
