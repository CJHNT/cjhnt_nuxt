export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const returnData = await $fetch('http://127.0.0.1:5000/api/dts/collections', {
    query: { id: body.id }
  })
  // return returnData
  return returnData
})
