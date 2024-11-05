import { changeUserPassword } from '~/utils/db'

// from https://snyk.io/blog/node-js-timing-attack-ccc-ctf/
function comparePasswords(a: string, b: string) {
  let mismatch = 0
  for (let i = 0; i < a.length; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch
}
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

    const { password, repeatPassword, userId } = body

    if (!password) {
      console.error('Password field is blank')
      return createError({
        statusCode: 400,
        statusMessage: 'Password is required'
      })
    } else if (comparePasswords(password, repeatPassword) !== 0) {
      console.error('Passwords do not match')

      return createError({
        statusCode: 400,
        statusMessage: 'Passwords must match'
      })
    }
    console.error(userId)
    if (typeof password === 'string') {
      const passwordChanged = await changeUserPassword(password, userId)
      if (passwordChanged) {
        return { error: null }
      }
      console.error('Error changing password')
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
