import { changeUserPassword, createSession } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  try {
    const body = await readBody(event) // Retrieve request body
    if (!body) {
      console.error('Request body is empty or undefined')
      return createError({
        statusCode: 400,
        statusMessage: 'Request body is empty or undefined'
      })
    }

    const { password, repeatPassword } = body

    if (!password) {
      console.error('Password field is blank')
      return createError({
        statusCode: 400,
        statusMessage: 'Password is required'
      })
    } else if (password !== repeatPassword) {
      console.error('Passwords do not match')

      return createError({
        statusCode: 400,
        statusMessage: 'Passwords must match'
      })
    }

    if (typeof password === 'string') {
      const passwordChanged = changeUserPassword(password, session.userId)
      if (passwordChanged) {
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
      console.error('Error changing password')
      return createError({
        statusCode: 409,
        statusMessage: 'Something went wrong while changing your password. No change was made.'
      })
    }
  } catch (error) {
    console.error('Error handling password change request:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to process request'
    })
  }
})
