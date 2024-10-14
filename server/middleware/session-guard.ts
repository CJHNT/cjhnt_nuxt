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
      const session = await requireUserSession(event)
      if (!verifySession(session.userId, session.token)) {
        throw createError({ status: 401 })
      }

      if (event.method !== 'GET') {
        const { csrfToken } = await readBody<{ csrfToken?: string }>(event)
        if (typeof csrfToken !== 'string') {
          throw createError({ status: 401 })
        } else {
          if (!verifyCsrfToken(session.userId, csrfToken)) {
            throw createError({ status: 401 })
          }
        }
      }

      if (event.path === '/api/_auth/session' && event.method === 'GET') {
        await sendWebResponse(event, Response.json({ user: session.user }))
      }
    } catch (error) {
      setCookie(event, 'nuxt-session', '')
      const session = await requireUserSession(event)
      deleteSession(session.userId)
      if (event.path.startsWith('/api/')) {
        throw error
      } else {
        await sendRedirect(event, '/')
      }
    }
  }
})
