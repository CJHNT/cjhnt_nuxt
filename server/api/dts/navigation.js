export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const returnData = await $fetch('http://127.0.0.1:5000/api/dts/navigation', {
    query: { id: body.id, level: body.level ? body.level : 1 }
  })
  // return returnData
  return returnData
})
