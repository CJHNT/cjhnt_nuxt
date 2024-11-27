import { mountSuspended } from '@nuxt/test-utils/runtime'
import AuthForm from '~/components/AuthForm.vue'
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

describe('AuthForm component', () => {
  test('Signup form renders correctly', async () => {
    const wrapper = await mountSuspended(AuthForm, {
      props: {
        title: 'auth.signUp'
      },
      global: {
        plugins: [vuetify, i18n]
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
