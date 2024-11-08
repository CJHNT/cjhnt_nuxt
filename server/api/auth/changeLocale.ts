import { changeUserLocale, createSession } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  try {
    if (['en', 'de'].includes(body.locale)) {
      const localeChanged = changeUserLocale(body.locale, session.userId)
      if (localeChanged) {
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
          return { error: null }
        }
      }
      return createError({
        statusCode: 409,
        statusMessage: 'Something went wrong while changing your locale. No change was made.'
      })
    }
  } catch (error) {
    console.error('Error changing update status:', error)
    return createError({
      statusCode: 409,
      statusMessage: 'Something went wrong while changing your locale. No change was made.'
    })
  }
})
