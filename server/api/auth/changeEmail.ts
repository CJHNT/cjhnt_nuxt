import { changeUserEmail, createSession } from '~/utils/db'

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

    const { email, repeatEmail } = body

    if (!email) {
      console.error('Email field is blank')
      return createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    } else if (email !== repeatEmail) {
      console.error('Email addresses do not match')

      return createError({
        statusCode: 400,
        statusMessage: 'Email addresses must match'
      })
    }

    if (typeof email === 'string') {
      const emailChanged = changeUserEmail(email, session.userId)
      if (emailChanged) {
        const result = createSession(email)
        if (result !== undefined) {
          await setUserSession(event, {
            user: {
              email,
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
      console.error('Error changing email')
      return createError({
        statusCode: 409,
        statusMessage: 'Something went wrong while changing your email address. No change was made.'
      })
    }
  } catch (error) {
    console.error('Error handling email change request:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to process request'
    })
  }
})
