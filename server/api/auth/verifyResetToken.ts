import jwt from 'jsonwebtoken'
import { verifyUserById } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  try {
    const verifiedToken = jwt.verify(body.token, config.sessionPassword)
    if (typeof verifiedToken === 'object') {
      const result = await verifyUserById(verifiedToken.verifyEmail)
      if (typeof result === 'number') {
        return { error: null, userId: result }
      }
    }
    return { error: 'auth.invalidResetToken', userId: null }
  } catch (error) {
    console.error('Error', error)
    return { error: 'auth.invalidResetToken', userId: null }
  }
})
