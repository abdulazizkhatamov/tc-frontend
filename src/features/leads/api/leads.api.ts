import type { PaginatedData } from '@/shared/types/api.type'
import type {
  LeadsFiltersType,
  LeadsType,
} from '@/features/leads/data/schema.ts'
import type {
  LeadSourceType,
  LeadStatusType,
  PriorityType,
} from '@/shared/schema/enum.schema.ts'
import axiosInstance from '@/config/axios.config'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const'

export class LeadNotFoundError extends Error {}

/* ============================================================
   🔹 GET - /leads
   ------------------------------------------------------------ */
export async function getLeads(
  filters: LeadsFiltersType,
): Promise<PaginatedData<LeadsType>> {
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

  const response = await axiosInstance.get<PaginatedData<LeadsType>>('/leads', {
    params,
  })

  return response.data
}

/* ============================================================
   🔹 GET - /leads/${id}
   ------------------------------------------------------------ */
export async function getLead(id: string): Promise<LeadsType> {
  const response = await axiosInstance.get<LeadsType>(`/leads/${id}`)
  return response.data
}

/* ============================================================
   🔹 POST - /leads
   ------------------------------------------------------------ */
interface PostLeadsPayload {
  fullName: string
  email: string
  phone?: string
  source: LeadSourceType
  status: LeadStatusType
  priority: PriorityType
  userId: string
  interestedCourses: Array<string>
}

export async function postLeads(
  leadData: PostLeadsPayload,
): Promise<LeadsType> {
  const response = await axiosInstance.post<LeadsType>('/leads', leadData)
  return response.data
}

/* ============================================================
   🔹 PATCH - /leads/${id}
   ------------------------------------------------------------ */
export interface PatchLeadsPayload {
  id: string
  name?: string
  email?: string
  phone?: string | null
  roles?: Array<'ADMIN' | 'STAFF' | 'INSTRUCTOR'>
  status?: boolean
}

export async function patchLead(
  leadData: PatchLeadsPayload,
): Promise<LeadsType> {
  const response = await axiosInstance.patch<LeadsType>(
    `/leads/${leadData.id}`,
    leadData,
  )
  return response.data
}
