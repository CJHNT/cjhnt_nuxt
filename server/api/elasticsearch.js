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
  const returnObject = {
    total: returnData.hits.total.value,
    hits: returnData.hits.hits.map((h) => {
      const hitObject = {
        urn: h['_source']['urn'],
        title: h['_source']['title'],
        highlight: h['highlight'] ? h['highlight'] : ''
      }
      return hitObject
    })
  }
  return returnObject
})
