export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const returnCode = await $fetch('http://127.0.0.1:5001/git', {
    method: 'post',
    body: {
      user: body.user
    }
  })
  return returnCode
})
