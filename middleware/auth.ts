export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    window.location.href = '/auth/login'
    return abortNavigation()
  }
})
