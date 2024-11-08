<script setup>
const notificationStore = useNotificationStore()
const route = useRoute()

const token = route.query.token
await useAsyncData(token + Date.now(), async () => {
  const verifiedToken = await $fetch('/api/auth/verifyEmailToken', {
    method: 'POST',
    body: {
      token: token
    }
  })
  if (verifiedToken.error) {
    notificationStore.addNotification({
      type: 'error',
      message: '',
      i18n: verifiedToken.error,
      link: '/auth/verifyEmail',
      linkMessage: 'auth.emailVerification.requestVerificationEmail'
    })
  } else if (verifiedToken.user) {
    notificationStore.addNotification({
      type: 'success',
      message: '',
      i18n: 'auth.emailVerification.emailVerifiedNotification',
      link: '/',
      linkMessage: 'home'
    })
  } else {
    notificationStore.addNotification({
      type: 'success',
      message: '',
      i18n: 'auth.emailVerification.emailVerifiedNotificationLogin',
      link: '/auth/login',
      linkMessage: 'auth.login'
    })
  }
  return true
})
</script>

<template>
  <v-main>
    <NotificationContainer />
  </v-main>
</template>
