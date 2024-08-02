export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)
  const returnData = await $fetch(`${config.esUrl}/cjhnt_dev/_search?pretty`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${config.esUser}:${config.esPw}`)
    },
    body: body
  })
  // return returnData
  return returnData.hits.hits.map((h) => [h['_source']['title'], h['highlight']['text']])
})
