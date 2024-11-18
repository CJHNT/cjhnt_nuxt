import { mount, RouterLinkStub } from '@vue/test-utils'
import NotificationBar from '../NotificationBar.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives
})

const notificationObject: GlobalNotification = {
  type: '',
  message: '',
  i18n: '',
  link: '',
  linkMessage: ''
}

function mountNotificationBar(config = { mountOptions: {} }) {
  return mount(NotificationBar, {
    props: { notification: notificationObject },
    global: {
      plugins: [vuetify],
      mocks: { $t: (key: string) => key },
      stubs: { NuxtLink: RouterLinkStub }
    },
    ...config.mountOptions
  })
}

describe('Notification Bar Component', () => {
  test('renders the correct styles for error, warning, success, info', () => {
    ;['error', 'warning', 'success', 'info'].forEach((status) => {
      notificationObject.type = status
      const wrapper = mountNotificationBar()
      expect(wrapper.classes()).toEqual(expect.arrayContaining([`bg-${status}`]))
    })
  })
  test('renders message when i18n is empty', () => {
    notificationObject.message = 'Some message'
    const wrapper = mountNotificationBar()
    expect(wrapper.text()).toEqual('Some message')
  })
  test('renders i18n when message is not empty', () => {
    notificationObject.i18n = 'Some i18n message'
    const wrapper = mountNotificationBar()
    expect(wrapper.text()).toEqual('Some i18n message')
  })
  test('link renders correct href and message', () => {
    notificationObject.link = '/'
    notificationObject.linkMessage = 'Home'
    const wrapper = mountNotificationBar()
    const linkComponent = wrapper.findComponent(RouterLinkStub)
    expect(linkComponent.props().to).toBe('/')
    expect(linkComponent.text()).toEqual('Home')
  })
  test('clicking button emits closeNotification', async () => {
    const mountOption = {
      data() {
        return {
          clicked: false
        }
      }
    }
    const wrapper = mountNotificationBar({ mountOptions: mountOption })
    const closeButton = wrapper.find('.v-alert__close .v-btn')
    await closeButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('closeNotification')
  })
})
