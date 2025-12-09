import type { PaginatedData } from '@/shared/types/api.type'

import type {
  CoursesFiltersType,
  CoursesType,
} from '@/features/courses/data/schema.ts'
import axiosInstance from '@/config/axios.config'
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '@/shared/consts/pagination.const'

export class CourseNotFoundError extends Error {}

/* ============================================================
   🔹 GET - /courses
   ------------------------------------------------------------ */
export async function getCourses(
  filters: CoursesFiltersType,
): Promise<PaginatedData<CoursesType>> {
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

  const response = await axiosInstance.get<PaginatedData<CoursesType>>(
    '/courses',
    {
      params,
    },
  )

  return response.data
}

/* ============================================================
   🔹 GET - /courses/${id}
   ------------------------------------------------------------ */
export async function getCourse(id: string): Promise<CoursesType> {
  const response = await axiosInstance.get<CoursesType>(`/courses/${id}`)
  return response.data
}

/* ============================================================
   🔹 POST - /courses
   ------------------------------------------------------------ */
interface PostCoursesPayload {
  title: string
  description?: string
  durationWeeks: number
  totalHours: number
  fee: number
  category: string
  status: boolean
}

export async function postCourses(
  courseData: PostCoursesPayload,
): Promise<CoursesType> {
  const response = await axiosInstance.post<CoursesType>('/courses', courseData)
  return response.data
}

/* ============================================================
   🔹 PATCH - /courses/${id}
   ------------------------------------------------------------ */
export interface PatchCoursesPayload {
  id: string
  title?: string
  description?: string
  durationWeeks?: number
  totalHours?: number
  fee?: number
  category?: string
  status?: boolean
}

export async function patchCourse(
  courseData: PatchCoursesPayload,
): Promise<CoursesType> {
  const response = await axiosInstance.patch<CoursesType>(
    `/courses/${courseData.id}`,
    courseData,
  )
  return response.data
}
