import bcrypt from 'bcrypt'
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

    const db = await initDb() // Initialize database connection
    const hashedPassword = await bcrypt.hash(password, 10) // Hash password

    try {
      // Change user's password address
      await db.run('UPDATE users SET password=? WHERE id=?', [hashedPassword, session.user.id])
      const user = await db.get('SELECT id, password FROM users WHERE id = ?', [session.user.id])
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
      console.error('Error changing password:', error)
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
