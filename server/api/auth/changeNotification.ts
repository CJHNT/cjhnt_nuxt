import { changeUserNotification, createSession } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const desiredStatus = session.user.wantsUpdates ? 0 : 1

  try {
    if (typeof desiredStatus === 'number') {
      const statusChanged = changeUserNotification(desiredStatus, session.userId)
      if (statusChanged) {
        const result = createSession(session.user.email)
        if (result !== undefined) {
          await setUserSession(event, {
            user: {
              email: session.user.email,
              role: result.role,
              verifiedEmail: result.verifiedEmail,
              wantsUpdates: result.wantsUpdates
            },
            userId: result.userId,
            token: result.sessionToken
          })
          return { error: null }
        }
      }
      return createError({
        statusCode: 409,
        statusMessage: 'Something went wrong while changing your update status. No change was made.'
      })
    }
  } catch (error) {
    console.error('Error changing update status:', error)
    return createError({
      statusCode: 409,
      statusMessage: 'Something went wrong while changing your update status. No change was made.'
    })
  }
})
