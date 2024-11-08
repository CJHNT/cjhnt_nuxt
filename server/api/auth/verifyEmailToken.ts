import jwt from 'jsonwebtoken'
import { verifyUserById, verifyUserEmailAddress, createSession } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  try {
    const verifiedToken = jwt.verify(body.token, config.sessionPassword)
    if (typeof verifiedToken === 'object') {
      const result = await verifyUserById(verifiedToken.verifyEmail)
      if (typeof result === 'number') {
        const emailVerified = await verifyUserEmailAddress(result)
        if (emailVerified) {
          const session = await getUserSession(event)
          if (session.user) {
            const result = createSession(session.user.email)
            if (result !== undefined) {
              await setUserSession(event, {
                user: {
                  email: session.user.email,
                  role: result.role,
                  verifiedEmail: result.verifiedEmail,
                  wantsUpdates: result.wantsUpdates,
                  locale: result.locale
                },
                userId: result.userId,
                token: result.sessionToken
              })
              return { error: null, user: result.userId }
            }
          }
          return { error: null, user: null }
        }
        return { error: 'auth.emailVerification.emailVerificationError', user: null }
      }
    }
    return { error: 'auth.emailVerification.invalidEmailVerificationToken', user: null }
  } catch (error) {
    console.error('Error', error)
    return { error: 'auth.emailVerification.invalidEmailVerificationToken', user: null }
  }
})
