import { initDb } from '../../db/database'

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

    const db = await initDb() // Initialize database connection

    try {
      // Change user's email address
      await db.run('UPDATE users SET email=? WHERE id=?', [email, session.user.id])
      const user = await db.get('SELECT id, email FROM users WHERE email = ?', [email])
      await setUserSession(event, {
        user: {
          ...user,
          password: undefined,
          verifiedEmail: user.verified_email !== 0,
          verified_email: undefined,
          wantsUpdates: user.wants_updates !== 0,
          wants_updates: undefined
        },
        loggedInAt: new Date()
      })
      return { success: true, user }
    } catch (error) {
      console.error('Error changing email:', error)
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
