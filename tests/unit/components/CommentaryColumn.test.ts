import { mountSuspended } from '@nuxt/test-utils/runtime'
import CommentaryColumn from '~/components/CommentaryColumn.vue'

describe('Commentary Column Component', async () => {
  const wrapper = await mountSuspended(CommentaryColumn, {
    props: { urn: '', reff: '', index: 0 }
  })
  test('component mounts', () => {
    expect(wrapper.html()).not.toBe('')
  })
})
