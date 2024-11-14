import { mount, config, RouterLinkStub } from '@vue/test-utils'
import NotificationBar from '../NotificationBar.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

config.global.plugins = [vuetify]
config.global.mocks = { $t: (key: string) => key }
config.global.stubs = { NuxtLink: RouterLinkStub }

describe('Notification Bar Component', () => {
  const notificationObject: GlobalNotification = {
    type: '',
    message: '',
    i18n: '',
    link: '',
    linkMessage: ''
  }
  test('renders the correct styles for error, warning, success, info', () => {
    ;['error', 'warning', 'success', 'info'].forEach((status) => {
      notificationObject.type = status
      const wrapper = mount(NotificationBar, {
        props: { notification: notificationObject }
      })
      expect(wrapper.classes()).toEqual(expect.arrayContaining([`bg-${status}`]))
    })
  })
  test('renders message when i18n is empty', () => {
    notificationObject.message = 'Some message'
    const wrapper = mount(NotificationBar, {
      props: { notification: notificationObject }
    })
    expect(wrapper.text()).toEqual('Some message')
  })
  test('renders i18n when message is not empty', () => {
    notificationObject.i18n = 'Some i18n message'
    const wrapper = mount(NotificationBar, {
      props: { notification: notificationObject }
    })
    expect(wrapper.text()).toEqual('Some i18n message')
  })
  describe('Test link', () => {
    test('renders correct href', () => {
      notificationObject.link = '/'
      notificationObject.linkMessage = 'Home'
      const wrapper = mount(NotificationBar, {
        props: { notification: notificationObject }
      })
      expect(wrapper.findComponent(RouterLinkStub).props().to).toBe('/')
    })
    test('renders correct message for link', () => {
      const wrapper = mount(NotificationBar, {
        props: { notification: notificationObject }
      })
      expect(wrapper.findComponent(RouterLinkStub).text()).toEqual('Home')
    })
  })
  test('clicking button emits closeNotification', async () => {
    const wrapper = mount(NotificationBar, {
      data() {
        return {
          clicked: false
        }
      },
      props: { notification: notificationObject }
    })
    const closeButton = wrapper.find('.v-alert__close .v-btn')
    await closeButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('closeNotification')
  })
})
