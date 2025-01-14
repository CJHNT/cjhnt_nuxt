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

describe('AuthForm sign-up form', async () => {
  const signUpWrapper = await mountSuspended(AuthForm, {
    props: {
      title: 'auth.signUp'
    },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('Signup form renders correct elements', () => {
    expect(signUpWrapper.find('[data-testid=email-input]').exists()).toBe(true)
    expect(signUpWrapper.find('[data-testid=password-input]').exists()).toBe(true)
    expect(signUpWrapper.find('[data-testid=repeat-password-input]').exists()).toBe(true)
    expect(signUpWrapper.find('[data-testid=updates-checkbox]').exists()).toBe(true)
    expect(signUpWrapper.find('[data-testid=login-link]').exists()).toBe(true)
    expect(signUpWrapper.find('[data-testid=repeat-email-input]').exists()).toBe(false)
    expect(signUpWrapper.find('[data-testid=signup-link]').exists()).toBe(false)
    expect(signUpWrapper.find('[data-testid=forgot-password-link]').exists()).toBe(false)
  })
  test('Email validation works', async () => {
    const emailField = signUpWrapper.find('[data-testid=email-input]')
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
  test('Password matching validation works', async () => {
    const passwordField = signUpWrapper.find('[data-testid=password-input]')
    const repeatPasswordField = signUpWrapper.find('[data-testid=repeat-password-input]')
    const passwordInput = passwordField.find('input')
    const repeatPasswordInput = repeatPasswordField.find('input')
    expect(repeatPasswordField.attributes('class')).not.toContain('v-input--error')
    await passwordInput.setValue('somePassword')
    await repeatPasswordInput.setValue('somePasswo')
    expect(repeatPasswordField.attributes('class')).toContain('v-input--error')
    await repeatPasswordInput.setValue('somePassword')
    expect(repeatPasswordField.attributes('class')).not.toContain('v-input--error')
  })
  test('showPassword buttons work', async () => {
    const passwordInput = signUpWrapper.find('[data-testid=password-input] input')
    const repeatPasswordInput = signUpWrapper.find('[data-testid=repeat-password-input] input')
    expect(passwordInput.attributes('type')).toBe('password')
    await signUpWrapper.find('[data-testid=password-input] .v-input__append i').trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')
    expect(repeatPasswordInput.attributes('type')).toBe('password')
    await signUpWrapper
      .find('[data-testid=repeat-password-input] .v-input__append i')
      .trigger('click')
    expect(repeatPasswordInput.attributes('type')).toBe('text')
  })
  test('submit event emits correctly', async () => {
    await signUpWrapper
      .find('[data-testid=updates-checkbox]')
      .find('input[type=checkbox]')
      .setValue()
    const form = signUpWrapper.find('form')
    await form.trigger('submit.prevent')
    expect(signUpWrapper.emitted()).toHaveProperty('submit')
    expect(signUpWrapper.emitted('submit')?.[0][0]).toStrictEqual({
      email: 'jim@mail.de',
      repeatEmail: '',
      password: 'somePassword',
      repeatPassword: 'somePassword',
      wantsUpdates: true
    })
  })
})

describe('AuthForm login form', async () => {
  const loginWrapper = await mountSuspended(AuthForm, {
    props: {
      title: 'auth.login'
    },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('login from renders correct elements', async () => {
    expect(loginWrapper.find('[data-testid=email-input]').exists()).toBe(true)
    expect(loginWrapper.find('[data-testid=repeat-email-input]').exists()).toBe(false)
    expect(loginWrapper.find('[data-testid=password-input]').exists()).toBe(true)
    expect(loginWrapper.find('[data-testid=repeat-password-input]').exists()).toBe(false)
    expect(loginWrapper.find('[data-testid=updates-checkbox]').exists()).toBe(false)
    expect(loginWrapper.find('[data-testid=login-link]').exists()).toBe(false)
    expect(loginWrapper.find('[data-testid=signup-link]').exists()).toBe(true)
    expect(loginWrapper.find('[data-testid=forgot-password-link]').exists()).toBe(true)
  })
})

describe('AuthForm changeEmail form', async () => {
  const changeEmailWrapper = await mountSuspended(AuthForm, {
    props: {
      title: 'auth.changeEmail',
      label: 'auth.newEmail'
    },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('changeEmail from renders correct elements', async () => {
    expect(changeEmailWrapper.find('[data-testid=email-input]').exists()).toBe(true)
    expect(changeEmailWrapper.find('[data-testid=repeat-email-input]').exists()).toBe(true)
    expect(changeEmailWrapper.find('[data-testid=password-input]').exists()).toBe(false)
    expect(changeEmailWrapper.find('[data-testid=repeat-password-input]').exists()).toBe(false)
    expect(changeEmailWrapper.find('[data-testid=updates-checkbox]').exists()).toBe(false)
    expect(changeEmailWrapper.find('[data-testid=login-link]').exists()).toBe(false)
    expect(changeEmailWrapper.find('[data-testid=signup-link]').exists()).toBe(false)
    expect(changeEmailWrapper.find('[data-testid=forgot-password-link]').exists()).toBe(false)
  })
  test('Email matching validation works', async () => {
    const emailField = changeEmailWrapper.find('[data-testid=email-input]')
    const repeatEmailField = changeEmailWrapper.find('[data-testid=repeat-email-input]')
    const emailInput = emailField.find('input')
    const repeatEmailInput = repeatEmailField.find('input')
    expect(repeatEmailField.attributes('class')).not.toContain('v-input--error')
    await emailInput.setValue('jim@mail.com')
    await repeatEmailInput.setValue('bob@mail.com')
    expect(repeatEmailField.attributes('class')).toContain('v-input--error')
    await repeatEmailInput.setValue('jim@mail.com')
    expect(repeatEmailField.attributes('class')).not.toContain('v-input--error')
  })
})

describe('AuthForm changePassword form', async () => {
  const changePasswordWrapper = await mountSuspended(AuthForm, {
    props: {
      title: 'auth.changePassword',
      label: 'auth.newPassword'
    },
    global: {
      plugins: [vuetify, i18n]
    }
  })
  test('changePassword from renders correct elements', async () => {
    expect(changePasswordWrapper.find('[data-testid=email-input]').exists()).toBe(false)
    expect(changePasswordWrapper.find('[data-testid=repeat-email-input]').exists()).toBe(false)
    expect(changePasswordWrapper.find('[data-testid=password-input]').exists()).toBe(true)
    expect(changePasswordWrapper.find('[data-testid=repeat-password-input]').exists()).toBe(true)
    expect(changePasswordWrapper.find('[data-testid=updates-checkbox]').exists()).toBe(false)
    expect(changePasswordWrapper.find('[data-testid=login-link]').exists()).toBe(false)
    expect(changePasswordWrapper.find('[data-testid=signup-link]').exists()).toBe(false)
    expect(changePasswordWrapper.find('[data-testid=forgot-password-link]').exists()).toBe(false)
  })
})
