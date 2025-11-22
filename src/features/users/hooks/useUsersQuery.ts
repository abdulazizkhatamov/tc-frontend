import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../api/users.api'

export const useUsersQuery = () => {
  return useQuery({ queryKey: ['users'], queryFn: getUsers })
}
