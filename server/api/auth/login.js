import bcrypt from 'bcrypt'
import { initDb } from '../../db/database'

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

    const db = await initDb() // Initialize database connection
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])

    // For security reasons, do not specify if email or password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error(`Invalid email or password for user: ${email}`)
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }
    const userReturnObject = {
      ...user,
      password: undefined,
      verifiedEmail: user.verified_email !== 0,
      verified_email: undefined
    }
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

    return { success: true, userReturnObject }
  } catch (error) {
    console.error('Error handling login request:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to process request'
    })
  }
})
