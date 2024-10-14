import { createSession, verifyPassword } from '~/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) // Retrieve request body
    if (!body) {
      console.error('Request body is empty or undefined')
      return createError({
        statusCode: 400,
        statusMessage: 'Request body is empty or undefined'
      })
    }

    const { email, password } = body

    if (!email || !password) {
      console.error('Email or password missing')
      return createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    if (typeof email === 'string' && typeof password === 'string') {
      const isValidPassword = await verifyPassword(email, password)
      if (isValidPassword) {
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
      console.error(`Invalid email or password for user: ${email}`)
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }
  } catch (error) {
    console.error('Error handling login request:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to process request'
    })
  }
})
