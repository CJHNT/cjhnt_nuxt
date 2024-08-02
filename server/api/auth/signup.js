import bcrypt from 'bcrypt'
import { initDb } from '../../db/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) // Retrieve request body
    if (!body) {
      return { error: 'Request body is empty or undefined' }
    }

    const { email, password, wantsUpdates } = body

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const db = await initDb() // Initialize database connection
    const hashedPassword = await bcrypt.hash(password, 10) // Hash password

    try {
      // Insert user data into database
      await db.run('INSERT INTO users (email, password, role, wants_updates) VALUES (?, ?, ?, ?)', [
        email,
        hashedPassword,
        'user',
        wantsUpdates ? 1 : 0
      ])
      const user = await db.get('SELECT id, email FROM users WHERE email = ?', [email])
      return { success: true, user }
    } catch (error) {
      console.error('Error creating user:', error)
      return createError({
        statusCode: 409,
        statusMessage: 'A user with this email already exists'
      })
    }
  } catch (error) {
    console.error('Error handling signup request:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
