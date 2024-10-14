export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    window.location.href = '/auth/login'
    return abortNavigation()
  } else if (user.value?.role && user.value?.role === 'user') {
    return abortNavigation({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
})
