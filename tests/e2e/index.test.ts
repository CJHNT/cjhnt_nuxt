// import { setup, createPage } from '@nuxt/test-utils/e2e'

// describe('index page', async () => {
//   await setup()

//   test('smoke test', () => {
//     expect(true).toBeTruthy()
//   })
//   test('Index page displays', async () => {
//     const page = await createPage('/')
//     const locater = page.locator('.news-title')
//     const expectedTitles = [
//       'Press release on the project launch',
//       'Work Conference 2025',
//       'The First Six Months...'
//     ]
//     expect(await locater.count()).toBe(3)
//     // expect(page.locator('.news-title')).toHaveText(['Press release on the project launch', 'Work Conference 2025', 'The First Six Months...'])
//   })
// })
import { expect, test } from '@nuxt/test-utils/playwright'

test('index page displays', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  const locator = page.locator('.news-title')
  expect(locator).toHaveText([
    'Press release on the project launch',
    'Work Conference 2025',
    'The First Six Months...'
  ])
})
