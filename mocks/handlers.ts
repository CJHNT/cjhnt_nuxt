import { http, HttpResponse } from 'msw'
import ploneResponse from './responses/plone.json'
import dtsCollectionsResponse from './responses/dtsCollections.json'

export const handlers = [
  http.get('/test', () => {
    const data = { message: `Hello from MSW server!` }
    return HttpResponse.json({ data })
  }),
  http.get('/api/plone/news/:locale', () => {
    const data = ploneResponse
    return HttpResponse.json({ data })
  }),
  http.post('/api/dts/collections', async ({ request }) => {
    const collId = await request.json()
    if (typeof collId === 'object') {
      const returnJson = dtsCollectionsResponse.find((c) => c['@id'] === collId?.id)
      return HttpResponse.json(returnJson)
    }
    return HttpResponse.json(dtsCollectionsResponse[0])
  })
]
