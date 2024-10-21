import { deleteSession, verifyCsrfToken, verifySession } from '@/utils/db'

const privateRoutes = [
  '/api/_auth/session GET',
  '/api/_auth/session DELETE',
  '/api/auth/csrf-token GET',
  '/api/auth/changeEmail POST',
  '/api/auth/changeNotification POST',
  '/api/auth/changePassword POST'
]

export default defineEventHandler(async (event) => {
  if (privateRoutes.includes(event.path + ' ' + event.method)) {
    try {
      const session = await requireUserSession(event, {
        statusCode: 401,
        message: `You must log in to view ${event.path}`
      })
      if (!verifySession(session.userId, session.token)) {
        throw createError({
          status: 401,
          message:
            'Something went wrong. You have been logged out for security reasons. Please log back in to continue.'
        })
      }

      if (event.method !== 'GET') {
        const { csrfToken } = await readBody<{ csrfToken?: string }>(event)
        if (typeof csrfToken !== 'string') {
          throw createError({
            status: 401,
            message:
              'Something went wrong. You have been logged out for security reasons. Please log back in to continue.'
          })
        } else {
          if (!verifyCsrfToken(session.userId, csrfToken)) {
            throw createError({
              status: 401,
              message:
                'Something went wrong. You have been logged out for security reasons. Please log back in to continue.'
            })
          }
        }
      }

      if (event.path === '/api/_auth/session' && event.method === 'GET') {
        await sendWebResponse(event, Response.json({ user: session.user }))
      }
    } catch (error) {
      setCookie(event, 'nuxt-session', '')
      const session = await requireUserSession(event, {
        statusCode: 401,
        message: `comptext.mustLogin`
      })
      deleteSession(session.userId)
      if (event.path.startsWith('/api/')) {
        throw error
      } else {
        throw createError({
          statusCode: 401,
          statusMessage: `You must log in to view ${event.path}`
        })
      }
    }
  }
})
