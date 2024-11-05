import jwt from 'jsonwebtoken'
import { verifyUserByEmail } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const userExists = await verifyUserByEmail(body.payload.email)
  if (userExists) {
    const token = jwt.sign({ userId: userExists }, config.sessionPassword, {
      expiresIn: 600
    })
    await $fetch('/api/mail/send', {
      method: 'POST',
      body: {
        mailRecipient: body.payload.email,
        mailSubject: 'Password Reset for CJHNT-digital',
        mailText:
          'We are trying to reset your password ' +
          `${config.baseUrl}auth/resetPassword?token=${token}`,
        mailHtml:
          'We are <i>trying</i> to reset your password ' +
          `${config.baseUrl}auth/resetPassword?token=${token}`
      }
    })
  }
  return false
})
