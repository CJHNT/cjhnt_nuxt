describe('MSW handlers', () => {
  test('msw server works', async () => {
    const result = await fetch('/test')
    const respJson = await result.json()
    expect(true).toBeTruthy()
    expect(respJson.data.message).toEqual('Hello from MSW server!')
  })

  test('plone server route works', async () => {
    const result = await fetch('/api/plone/news/en')
    const respJson = await result.json()
    expect(true).toBeTruthy()
    expect(respJson.data.items.length).toEqual(3)
  })

  test('dts collections route works', async () => {
    const result = await fetch('/api/dts/collections', {
      method: 'POST',
      body: JSON.stringify({ id: 'wissen_texts' })
    })
    const respJson = await result.json()
    expect(true).toBeTruthy()
    expect(respJson['@id']).toEqual('wissen_texts')
  })
})
