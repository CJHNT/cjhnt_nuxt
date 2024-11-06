import jwt from 'jsonwebtoken'
import { verifyUserByEmail } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const userExists = await verifyUserByEmail(body.payload.email)
  const t = await useTranslation(event)
  if (userExists) {
    const token = jwt.sign({ userId: userExists }, config.sessionPassword, {
      expiresIn: 600
    })
    await $fetch('/api/mail/send', {
      method: 'POST',
      body: {
        mailRecipient: body.payload.email,
        mailSubject: 'Password Reset for CJHNT-digital',
        mailText: `${t('auth.passwordResetEmail.greeting')}  ${body.payload.email},

          ${t('auth.passwordResetEmail.htmlReset')} ${t('auth.passwordResetEmail.clickHere')}

          ${config.baseUrl}auth/resetPassword?token=${token}

          ${t('auth.passwordResetEmail.ignore')}

          ${t('auth.passwordResetEmail.sincerely')}
          
          ${t('auth.passwordResetEmail.sender')}
          `,
        mailHtml: `<!doctype html>
          <html>
            <body>
              <p>${t('auth.passwordResetEmail.greeting', [body.payload.email])}</p>
              <p>
                  ${t('auth.passwordResetEmail.htmlReset')}
                  <a href="${config.baseUrl}auth/resetPassword?token=${token}">
                      ${t('auth.passwordResetEmail.clickHere')}
                  </a>.
              </p>
              <p>${t('auth.passwordResetEmail.alternatively')}</p>
              <p>${config.baseUrl}auth/resetPassword?token=${token}</p>
              <p>${t('auth.passwordResetEmail.ignore')}</p>
              <p>${t('auth.passwordResetEmail.sincerely')}</p>
              <p>${t('auth.passwordResetEmail.sender')}</p>
            </body>
          </html>`
      }
    })
  }
  return false
})
