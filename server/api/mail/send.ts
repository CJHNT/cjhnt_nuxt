import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)
  const transporter = nodemailer.createTransport({
    host: config.mailHost,
    port: parseInt(config.mailPort),
    secure: true,
    auth: { user: config.mailSender, pass: config.mailPw }
  })
  const message = {
    from: config.mailSender,
    to: body.mailRecipient,
    subject: body.mailSubject,
    text: body.mailText,
    html: body.mailHtml
  }
  transporter.sendMail(message, () => {
    // tell user that the mail was sent and that if they don't receive it in a few minutes to try again
  })
})
