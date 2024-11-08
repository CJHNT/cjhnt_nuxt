export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()
  const pinia = usePinia()
  const notificationStore = useNotificationStore(pinia)
  const authorized = useState('authorized')

  if (!loggedIn.value) {
    notificationStore.addNotification({
      type: 'error',
      message: '',
      i18n: 'auth.onlyRegistered',
      link: '/auth/login',
      linkMessage: 'auth.login'
    })
    authorized.value = false
  } else if (!user.value?.verifiedEmail) {
    notificationStore.addNotification({
      type: 'warning',
      message: '',
      i18n: 'auth.emailVerification.emailVerificationEmail.explanation',
      link: '/auth/verifyEmail',
      linkMessage: 'auth.emailVerification.requestVerificationEmail'
    })
    authorized.value = false
  } else if (user.value?.role && user.value?.role === 'user') {
    notificationStore.addNotification({
      type: 'error',
      message: '',
      i18n: 'auth.onlyProject',
      link: '/',
      linkMessage: 'home'
    })
    authorized.value = false
  } else {
    authorized.value = true
  }
})
