import { mountSuspended } from '@nuxt/test-utils/runtime'
import BreadCrumb from '~/components/BreadCrumb.vue'
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

describe('BreadCrumb component', () => {
  test('first breadcrumb', async () => {
    const wrapper = await mountSuspended(BreadCrumb, {
      props: {
        ancestors: [
          {
            disabled: false,
            title: {
              de: 'Kommentare',
              en: 'Commentaries'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary'
          },
          {
            disabled: false,
            title: {
              de: 'Kommentar zu 1. Timotheus',
              en: 'Commentary on 1 Timothy'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary.1tim'
          },
          {
            disabled: true,
            title: {
              de: '1,1/2 Der Messias als ἐλπίς ',
              en: '1,1/2 The Messiah as ἐλπίς'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary.1tim.001_001_002'
          }
        ],
        index: 0
      },
      global: {
        plugins: [vuetify, i18n]
      }
    })
    expect(wrapper.find('.v-breadcrumbs__prepend').text()).toBe('/')
    expect(wrapper.findAll('a')).toHaveLength(2)
    expect(wrapper.find('a').attributes('href')).toBe('/collection/urn-cts-cjhnt-commentary')
  })
  test('second breadcrumb', async () => {
    const wrapper = await mountSuspended(BreadCrumb, {
      props: {
        ancestors: [
          {
            disabled: false,
            title: {
              de: 'Kommentare',
              en: 'Commentaries'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary'
          },
          {
            disabled: false,
            title: {
              de: 'Kommentar zu 1. Timotheus',
              en: 'Commentary on 1 Timothy'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary.1tim'
          },
          {
            disabled: true,
            title: {
              de: '1,1/2 Der Messias als ἐλπίς ',
              en: '1,1/2 The Messiah as ἐλπίς'
            },
            ref: '',
            id: 'urn:cts:cjhnt:commentary.1tim.001_001_002'
          }
        ],
        index: 1
      },
      global: {
        plugins: [vuetify, i18n]
      }
    })
    expect(wrapper.find('.v-breadcrumbs__prepend').find('i').attributes('class')).toContain(
      'mdi-subdirectory-arrow-right'
    )
  })
})
