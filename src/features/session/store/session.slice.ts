// features/session/session.slice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { SessionInterface } from '@/shared/schema/session.schema'
import axiosInstance from '@/config/axios.config'

const initialState: SessionInterface = {
  session: null,
  isSessionReady: false,
}

export const fetchSession = createAsyncThunk(
  'session/fetchSession',
  async () => {
    const res = await axiosInstance.get('/session')
    return res.data as SessionInterface
  },
)

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    logout(state) {
      state.session = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.session = action.payload.session
        state.isSessionReady = true
      })
      .addCase(fetchSession.rejected, (state) => {
        state.session = null
        state.isSessionReady = true
      })
  },
})

export const { logout } = sessionSlice.actions
export default sessionSlice.reducer
