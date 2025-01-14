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
      props: { urn: 'urn:cts:greekLit:tlg0527.tlg001.hanhart', reff: '50.26' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:greekLit:tlg0527.tlg001.hanhart;50.26'
    })
    expect(wrapper.find('h1').text()).toBe('Genesis 50.26')
  })
  test('component deals correctly with invalid reference', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:greekLit:tlg0527.tlg001.hanhart', reff: '1.100' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:greekLit:tlg0527.tlg001.hanhart;1.100'
    })
    expect(wrapper.find('h1').text()).toBe('Genesis 1.1')
  })
  test('project members can read closed texts', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:cjhnt:1henoch.1henoch.stuckenbruck', reff: '1.1' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:cjhnt:1henoch.1henoch.stuckenbruck;1.1'
    })
    expect(wrapper.find('.citation-section').text()).toContain('ቃለ')
  })
  test('non-project members cannot read closed texts', async () => {
    mockedProject.role = 'user'
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:cjhnt:1henoch.1henoch.stuckenbruck', reff: '1.1' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:cjhnt:1henoch.1henoch.stuckenbruck;1.1'
    })
    expect(wrapper.find('.v-alert__content').text()).toContain(
      'This text is only available to project members'
    )
  })
  test('non-project members do not have a link to closed versions', async () => {
    const wrapper = await mountSuspended(TextColumn, {
      props: { urn: 'urn:cts:cjhnt:1henoch.1henoch.cjhnt_eng', reff: '61.5' },
      global: {
        plugins: [vuetify, i18n]
      },
      route: '/texts/urn:cts:cjhnt:1henoch.1henoch.cjhnt_eng;61.5'
    })
    expect(wrapper.find('.citation-section').text()).toContain('These')
  })
})
