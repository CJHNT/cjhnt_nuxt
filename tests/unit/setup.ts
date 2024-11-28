import { server } from '../../mocks/node.js'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import dtsCollectionResponse from '~/mocks/responses/dtsCollections.json'
import dtsNavigationResponse from '~/mocks/responses/dtsNavigation.json'
import { xmlTexts } from '~/mocks/responses/dtsDocument.js'
import ploneResponse from '~/mocks/responses/plone.json'
import { readBody } from 'h3'
import { writeFile } from 'node:fs'
import { resolvePath } from 'nuxt/kit'

registerEndpoint('/api/dts/collections', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    const returnJson = dtsCollectionResponse.find((c) => c['@id'] === body.id)
    if (!returnJson && body.id) {
      const newData = await (
        await fetch(`http://localhost:5000/api/dts/collections?id=${body.id}`)
      ).json()
      dtsCollectionResponse.push(newData)
      const savePath = await resolvePath('./mocks/responses/dtsCollections.json')
      writeFile(savePath, JSON.stringify(dtsCollectionResponse), (err) => {
        if (err) {
          throw err
        }
      })
      return newData
    }
    return returnJson
  }
})

registerEndpoint('/api/dts/navigation', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    const returnJson = dtsNavigationResponse.find((c) => c['@id'].includes(body.id))
    if (!returnJson && body.id) {
      const newData = await (
        await fetch(`http://localhost:5000/api/dts/navigation?id=${body.id}`)
      ).json()
      dtsNavigationResponse.push(newData)
      const savePath = await resolvePath('./mocks/responses/dtsNavigation.json')
      writeFile(savePath, JSON.stringify(dtsNavigationResponse), (err) => {
        if (err) {
          throw err
        }
      })
      return newData
    }
    return returnJson
  }
})

registerEndpoint('/api/dts/document', {
  method: 'POST',
  handler: async (event) => {
    const body = await readBody(event)
    return xmlTexts.find((c) => c.id === body.id)?.xml
  }
})

registerEndpoint('/api/plone/news/:locale', () => {
  const data = ploneResponse
  return data
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
