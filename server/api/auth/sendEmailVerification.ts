import jwt from 'jsonwebtoken'
import { verifyUserByEmail } from '~/utils/db'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const userExists = await verifyUserByEmail(body.payload.email)
  const t = await useTranslation(event)
  if (userExists) {
    const token = jwt.sign({ verifyEmail: userExists }, config.sessionPassword, {
      expiresIn: 600
    })
    await $fetch('/api/mail/send', {
      method: 'POST',
      body: {
        mailRecipient: body.payload.email,
        mailSubject: t('auth.emailVerification.emailVerificationEmail.subject'),
        mailText: `${t('auth.emailVerification.emailVerificationEmail.greeting', [body.payload.email])}

${t('auth.emailVerification.emailVerificationEmail.htmlReset')} ${t('auth.emailVerification.emailVerificationEmail.clickHere')}

${config.baseUrl}auth/emailVerification?token=${token}

${t('auth.emailVerification.emailVerificationEmail.explanation')}

${t('auth.emailVerification.emailVerificationEmail.sincerely')}
          
${t('auth.emailVerification.emailVerificationEmail.sender')}
`,
        mailHtml: `<!doctype html>
          <html>
            <body>
              <p>${t('auth.emailVerification.emailVerificationEmail.greeting', [body.payload.email])}</p>
              <p>
                  ${t('auth.emailVerification.emailVerificationEmail.htmlReset')}
                  <a href="${config.baseUrl}auth/emailVerification?token=${token}">
                      ${t('auth.emailVerification.emailVerificationEmail.clickHere')}
                  </a>.
              </p>
              <p>${t('auth.emailVerification.emailVerificationEmail.alternatively')}</p>
              <p>${config.baseUrl}auth/emailVerification?token=${token}</p>
              <p>${t('auth.emailVerification.emailVerificationEmail.explanation')}</p>
              <p>${t('auth.emailVerification.emailVerificationEmail.sincerely')}</p>
              <p>${t('auth.emailVerification.emailVerificationEmail.sender')}</p>
            </body>
          </html>`
      }
    })
  }
  return false
})
