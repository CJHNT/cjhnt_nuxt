export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    const pinia = usePinia()
    const notificationStore = useNotificationStore(pinia)
    notificationStore.addNotification({
      type: 'warning',
      message: '',
      i18n: 'auth.onlyRegistered',
      link: '/auth/login',
      linkMessage: 'auth.login'
    })
    // window.location.href = '/auth/login'
    // return navigateTo('/auth/login')
  }
})
