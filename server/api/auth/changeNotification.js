import { initDb } from '../../db/database'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const db = await initDb() // Initialize database connection

  try {
    // Change user's notification status
    await db.run('UPDATE users SET wants_updates=? WHERE id=?', [
      session.user.wantsUpdates ? 0 : 1,
      session.user.id
    ])
    const user = await db.get('SELECT id, wants_updates FROM users WHERE id = ?', [session.user.id])
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
    console.log(session.user)
    return { success: true, user }
  } catch (error) {
    console.error('Error changing email:', error)
    return createError({
      statusCode: 409,
      statusMessage: 'Something went wrong while changing your email address. No change was made.'
    })
  }
})
