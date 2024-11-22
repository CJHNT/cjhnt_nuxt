import { mountSuspended } from '@nuxt/test-utils/runtime'
import CommentaryColumn from '~/components/CommentaryColumn.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import enLang from '~/lang/en.json'
import deLang from '~/lang/de.json'
import { flushPromises } from '@vue/test-utils'

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

const i18nDe = createI18n({
  locale: 'de',
  messages: {
    en: enLang,
    de: deLang
  }
})

describe('Commentary Column Component', async () => {
  const enWrapper = await mountSuspended(CommentaryColumn, {
    props: { urn: 'urn:cts:cjhnt:commentary.1tim.001_001_002', reff: '1', index: 0 },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('component mounts', () => {
    expect(enWrapper.html()).toMatchSnapshot()
  })
  test('switches correctly from en to de', async () => {
    const deWrapper = await mountSuspended(CommentaryColumn, {
      props: { urn: 'urn:cts:cjhnt:commentary.1tim.001_001_002', reff: '1', index: 0 },
      global: {
        plugins: [vuetify, i18nDe]
      }
    })
    expect(deWrapper.html()).toMatchSnapshot()
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
