import { setup, $fetch, createPage, url } from '@nuxt/test-utils/e2e'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

mockNuxtImport('useUserSession', () => {
  return {
    loggedIn: true,
    user: ref({
      verifiedEmail: true,
      role: 'project'
    })
  }
})

mockNuxtImport('useState', () => {
  return () => true
})

describe('tests/[slug].vue tests', async () => {
  await setup()
  test('smoke test', () => {
    expect(true).toBeTruthy()
  })

  test('page loads', async () => {
    const page = await createPage('/texts/urn:cts:cjhnt:commentary.1tim.001_001_002')
    const title = page.textContent('[data-testid=lang-switcher]')
    const pageHtml = await page.innerHTML('html')
    await flushPromises()
    expect(pageHtml).toMatchSnapshot()
    //   const page = await createPage('/texts/urn:cts:cjhnt:commentary.1tim.001_001_002')
    //   const title = page.textContent('[data-testid=lang-switcher]')
    //   expect(title).toContain('The Messiah as ἐλπίς')
    // },
    // {
    //   timeout: 60000
    // }
  })
})
