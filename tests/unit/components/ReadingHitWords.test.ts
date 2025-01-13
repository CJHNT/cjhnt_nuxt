import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import TextColumn from '~/components/TextColumn.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createI18n } from 'vue-i18n'
import enLang from '~/lang/en.json'
import deLang from '~/lang/de.json'
import type { User, UserSession } from '#auth-utils'

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

const mockedProject: User = {
  email: 'project@member.com',
  role: 'project',
  verifiedEmail: true,
  wantsUpdates: true,
  locale: 'en'
}

const mockedSession: UserSession = {
  user: mockedProject,
  userId: mockedProject.email,
  token: 'someToken'
}

mockNuxtImport('useUserSession', () => () => {
  return {
    user: ref(mockedProject),
    ready: true,
    loggedIn: true,
    session: ref(mockedSession),
    fetch: () => null,
    clear: () => null
  }
})

mockNuxtImport('useState', () => {
  return () => ref(['11', '13', '15'])
})

describe('Make sure hit words are correctly displayed', async () => {
  test('search highlights are correctly displayed in TextColumn', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:cjhnt:1henoch.1henoch.stuckenbruck', reff: '1.1' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:cjhnt:1henoch.1henoch.stuckenbruck;1.1'
    })
    expect(wrapper.find('span[n=w-11]').attributes('class')).toContain('searchHit')
    expect(wrapper.find('span[n=w-12]').attributes('class')).not.toContain('searchHit')
  })
})
