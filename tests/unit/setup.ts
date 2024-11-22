import { server } from '../../mocks/node.js'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import dtsCollectionResponse from '~/mocks/responses/dtsCollections.json'
import dtsNavigationResponse from '~/mocks/responses/dtsNavigation.json'
import { xmlTexts } from '~/mocks/responses/dtsDocument.js'
import { readBody } from 'h3'

registerEndpoint('/api/dts/collections', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    return dtsCollectionResponse.find((c) => c['@id'] === body.id)
  }
})

registerEndpoint('/api/dts/navigation', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    return dtsNavigationResponse.find((c) => c['@id'].includes(body.id))
  }
})

registerEndpoint('/api/dts/document', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    return xmlTexts.find((c) => c.id === body.id)?.xml
  }
})

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
