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

describe('AuthForm component', async () => {
  const wrapper = await mountSuspended(AuthForm, {
    props: {
      title: 'auth.signUp'
    },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('Signup form renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
  test('Email validation works', async () => {
    const emailField = wrapper.find('[data-testid=email-input]')
    const emailInput = emailField.find('input')
    expect(emailField.attributes('class')).not.toContain('v-input--error')
    await emailInput.setValue('jim@email.com')
    expect(emailField.attributes('class')).not.toContain('v-input--error')
    await emailInput.setValue('jim')
    expect(emailField.attributes('class')).toContain('v-input--error')
    await emailInput.setValue('jim@mail.d')
    expect(emailField.attributes('class')).toContain('v-input--error')
    await emailInput.setValue('jim@mail.de')
    expect(emailField.attributes('class')).not.toContain('v-input--error')
  })
  test('Password matching works', async () => {
    const passwordField = wrapper.find('[data-testid=password-input]')
    const repeatPasswordField = wrapper.find('[data-testid=repeat-password-input]')
    const passwordInput = passwordField.find('input')
    const repeatPasswordInput = repeatPasswordField.find('input')
    expect(repeatPasswordField.attributes('class')).not.toContain('v-input--error')
    await passwordInput.setValue('somePassword')
    await repeatPasswordInput.setValue('somePassword')
    expect(repeatPasswordField.attributes('class')).not.toContain('v-input--error')
    await repeatPasswordInput.setValue('somePasswo')
    expect(repeatPasswordField.attributes('class')).toContain('v-input--error')
  })
  test('submit button emits correctly', async () => {
    const submitButton = wrapper.find('[data-testid=submit-button]')
    await submitButton.trigger('click')
    expect(submitButton.emitted()).toHaveProperty('submit')
  })
})
