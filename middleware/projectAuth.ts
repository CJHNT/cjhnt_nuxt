export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/auth/login')
  } else if (user.value?.role && user.value?.role === 'user') {
    return abortNavigation({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }
})
