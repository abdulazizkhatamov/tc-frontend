// features/session/session.slice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSession } from '../api/session.api'
import type { SessionInterface } from '@/features/session/schema/session.schema'

const initialState: SessionInterface = {
  session: null,
  isSessionReady: false,
}

export const fetchSession = createAsyncThunk('session/fetchSession', getSession)

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
