export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth-plugin', () => {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value) {
      const nuxtApp = useNuxtApp()
      nuxtApp.hook('app:beforeMount', () => {
        const pinia = usePinia()
        const notificationStore = useNotificationStore(pinia)
        notificationStore.addNotification({
          type: 'warning',
          message: 'You must be logged in to view this page.'
        })
      })
      window.location.href = '/auth/login'
      return abortNavigation()
    }
  })
})
