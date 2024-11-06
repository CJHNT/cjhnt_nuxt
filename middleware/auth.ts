export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()
  const authorized = useState('authorized')

  if (!loggedIn.value) {
    const pinia = usePinia()
    const notificationStore = useNotificationStore(pinia)
    notificationStore.addNotification({
      type: 'error',
      message: '',
      i18n: 'auth.onlyRegistered',
      link: '/auth/login',
      linkMessage: 'auth.login'
    })
    authorized.value = false
    // window.location.href = '/auth/login'
    // return navigateTo('/auth/login')
  } else {
    authorized.value = true
  }
})
