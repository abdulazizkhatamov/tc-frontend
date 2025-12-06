import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
} from '../consts/pagination.const'

export const cleanEmptyParams = <T extends Record<string, unknown>>(
  search: T,
) => {
  const newSearch = { ...search }

  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key]

    const isEmptyArray = Array.isArray(value) && value.length === 0

    const isEmpty =
      value === undefined ||
      value === '' ||
      (typeof value === 'number' && isNaN(value)) ||
      isEmptyArray

    if (isEmpty) delete newSearch[key]
  })

  if (newSearch.pageIndex === DEFAULT_PAGE_INDEX) delete newSearch.pageIndex
  if (newSearch.pageSize === DEFAULT_PAGE_SIZE) delete newSearch.pageSize

  return newSearch
}
