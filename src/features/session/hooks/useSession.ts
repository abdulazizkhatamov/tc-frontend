import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchSession, logout } from '../store/session.slice'
import type { AppDispatch, RootState } from '@/app/store'

export const useSession = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { session, isSessionReady } = useSelector(
    (state: RootState) => state.session,
  )

  useEffect(() => {
    if (!isSessionReady) {
      dispatch(fetchSession())
    }
  }, [dispatch, isSessionReady])

  return {
    session,
    isSessionReady,
    fetchSession: () => dispatch(fetchSession()),
    logout: () => dispatch(logout()),
  }
}
