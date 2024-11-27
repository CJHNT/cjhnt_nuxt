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

describe('Commentary Column Component', async () => {
  const enWrapper = await mountSuspended(TextColumn, {
    props: { urn: 'urn:cts:greekLit:tlg0018.tlg001.1st1K-eng1', reff: 'title', index: 0 },
    global: {
      plugins: [vuetify, i18n]
    },
    route: '/texts/urn:cts:greekLit:tlg0018.tlg001.1st1K-eng1;title'
  })
  test('component mounts', () => {
    expect(enWrapper.html()).toMatchSnapshot()
  })
  // I think this doesn't work because the textPage.js file is not loaded on the component but on the page
  // test('clicking belegstelle-erlautert reveals the text in section D', async () => {
  //   const clickElement = enWrapper.find('[class*=belegstelle-erl]')
  //   const targetEl = enWrapper.find(`${clickElement.attributes('data-target')}`)
  //   let expandElement = targetEl.element.parentElement
  //   expect(expandElement?.classList.contains('border-opacity-0')).toBe(true)
  //   await clickElement.trigger('click')
  //   expandElement = targetEl.element.parentElement
  //   expect(expandElement?.classList.contains('border-opacity-0')).toBe(false)
  // })
})
