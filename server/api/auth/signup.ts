import { createUser } from '~/utils/db'

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

    const { email, password, wantsUpdates } = body

    if (!email || !password) {
      console.error('Email or password missing')
      return createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }

    const isCreated = await createUser(email, password, wantsUpdates)
    if (isCreated) {
      return { error: null }
    }
  } catch (error) {
    console.error('Error handling signup request:', error)
    return createError({
      statusCode: 400,
      statusMessage: 'Failed to process request'
    })
  }
})
