import z from 'zod'

export const sessionSchema = z.object({
  id: z.string(),
  email: z.string(),
})

export type SessionType = z.infer<typeof sessionSchema>
export interface SessionInterface {
  session: SessionType | null
}
