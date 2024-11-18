import { mount, flushPromises } from '@vue/test-utils'
import App from '../../app.vue'

describe('Index page', async () => {
  test('smoke test', () => {
    expect(true).toBeTruthy()
  })
  test('that HTML exists', async () => {
    const wrapper = mount(App)
    await flushPromises()
    expect(wrapper.text()).toContain('Welcome')
  })
})
