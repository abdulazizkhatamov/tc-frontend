import z from 'zod'

export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
})

export type SessionType = z.infer<typeof sessionSchema>
export interface SessionInterface {
  session: SessionType | null
  isSessionReady: boolean
}
