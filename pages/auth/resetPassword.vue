<script setup>
const route = useRoute()
const { loggedIn } = useUserSession()
const notificationStore = useNotificationStore()
const userId = ref(null)
const tokenError = ref(null)
const loading = ref(false)

if (!loggedIn.value) {
  const token = route.query.token
  await useAsyncData(token + Date.now(), async () => {
    const verifiedToken = await $fetch('/api/auth/verifyResetToken', {
      method: 'POST',
      body: {
        token: token
      }
    })
    if (verifiedToken.error) {
      tokenError.value = verifiedToken.error
      notificationStore.addNotification({
        type: 'error',
        message: '',
        i18n: verifiedToken.error,
        link: '/auth/forgotPassword',
        linkMessage: 'auth.forgotPassword'
      })
    } else if (verifiedToken.userId) {
      userId.value = verifiedToken.userId
    }
    return true
  })
} else {
  notificationStore.addNotification({
    type: 'warning',
    message: '',
    i18n: 'auth.alreadyLoggedIn',
    link: '/auth/dashboard',
    linkMessage: 'auth.dashboard'
  })
}
const resetPassword = async (body) => {
  loading.value = true
  try {
    await $fetch('/api/auth/resetPassword', {
      method: 'POST',
      body: { ...body, userId: userId.value }
    })
    notificationStore.addNotification({
      type: 'success',
      message: '',
      i18n: 'auth.passwordReset',
      link: '/auth/login',
      linkMessage: 'auth.login'
    })
    loading.value = false
  } catch (error) {
    alert(error.statusMessage || error)
    loading.value = false
  }
}
</script>

<template>
  <v-main>
    <NotificationContainer />
    <v-container v-if="userId">
      <v-row justify="center">
        <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
          <AuthForm
            :loading="loading"
            title="auth.changePassword"
            label="auth.newPassword"
            @submit="resetPassword"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
