import { mountSuspended } from '@nuxt/test-utils/runtime'
import TextColumn from '~/components/TextColumn.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import enLang from '~/lang/en.json'
import deLang from '~/lang/de.json'

const vuetify = createVuetify({
  components,
  directives
})

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: enLang,
    de: deLang
  }
})

describe('Text Column Component', async () => {
  const enWrapper = await mountSuspended(TextColumn, {
    props: { urn: 'urn:cts:greekLit:tlg0018.tlg001.1st1K-eng1', reff: 'title' },
    global: {
      plugins: [vuetify, i18n]
    },
    route: '/texts/urn:cts:greekLit:tlg0018.tlg001.1st1K-eng1;title'
  })
  test('component mounts', () => {
    expect(enWrapper.html()).toMatchSnapshot()
  })
  test('component deals correctly with depth of reference', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:greekLit:tlg0527.tlg001.hanhart', reff: '1.1' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:greekLit:tlg0527.tlg001.hanhart;1.1'
    })
    expect(wrapper.find('h1').text()).toBe('Genesis 1.1')
  })
  test('component deals correctly with invalid reference', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:greekLit:tlg0527.tlg001.hanhart', reff: '1.100' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:greekLit:tlg0527.tlg001.hanhart;1.1'
    })
    expect(wrapper.find('h1').text()).toBe('Genesis 1.1')
  })
})
