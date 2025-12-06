import type { PaginatedData } from '@/shared/types/api.type'
import type { UsersFiltersType, UsersType } from '../data/schema'
import axiosInstance from '@/config/axios.config'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const'

/* ============================================================
   🔹 GET - /users
   ------------------------------------------------------------ */
export async function getUsers(
  filters: UsersFiltersType,
): Promise<PaginatedData<UsersType>> {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy,
    ...otherFilters
  } = filters

  const params: Record<string, any> = {
    pageIndex,
    pageSize,
    ...otherFilters,
  }

  if (sortBy) {
    const [field, order] = sortBy.split('.') as [string, 'asc' | 'desc']
    params.sortField = field
    params.sortOrder = order
  }

  const response = await axiosInstance.get<PaginatedData<UsersType>>('/users', {
    params,
  })

  return response.data
}

/* ============================================================
   🔹 POST - /users
   ------------------------------------------------------------ */
interface PostUsersPayload {
  name: string
  email: string
  password: string
  phone: string
  roles: Array<'ADMIN' | 'STAFF' | 'INSTRUCTOR'>
  status: boolean
}

export async function postUsers(
  userData: PostUsersPayload,
): Promise<UsersType> {
  const response = await axiosInstance.post<UsersType>('/users', userData)
  return response.data
}
