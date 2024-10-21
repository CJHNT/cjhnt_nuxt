<script setup>
import AuthForm from '@/components/AuthForm.vue'

definePageMeta({
  middleware: ['auth']
})

const { loggedIn, user, fetch } = useUserSession()
const loading = ref(false)
const router = useRouter()
const notificationStore = useNotificationStore()
const { t } = useI18n()

await fetch()

const changeEmail = async (body) => {
  loading.value = true
  const { csrfToken } = await $fetch('/api/auth/csrf-token')
  try {
    await $fetch('/api/auth/changeEmail', {
      method: 'POST',
      body: { ...body, csrfToken }
    })
    await fetch()
    router.push({ name: 'auth-dashboard' })
    const notificationType = 'success'
    const notificationMessage = t('auth.emailChanged')
    notificationStore.addNotification({ type: notificationType, message: notificationMessage })
    loading.value = false
  } catch (error) {
    alert(error.statusMessage || error)
    loading.value = false
  }
}
const changePassword = async (body) => {
  loading.value = true
  const { csrfToken } = await $fetch('/api/auth/csrf-token')
  try {
    await $fetch('/api/auth/changePassword', {
      method: 'POST',
      body: { ...body, csrfToken }
    })
    await fetch()
    router.push({ name: 'auth-dashboard' })
    const notificationType = 'success'
    const notificationMessage = t('auth.passwordChanged')
    notificationStore.addNotification({ type: notificationType, message: notificationMessage })
    loading.value = false
  } catch (error) {
    alert(error.statusMessage || error)
    loading.value = false
  }
}
const changeNotification = async (body) => {
  loading.value = true
  const { csrfToken } = await $fetch('/api/auth/csrf-token')
  try {
    await $fetch('/api/auth/changeNotification', {
      method: 'POST',
      body: { ...body, csrfToken }
    })
    await fetch()
    router.push({ name: 'auth-dashboard' })
    const notificationType = 'success'
    const notificationMessage =
      user.value.wantsUpdates === true ? t('auth.updatesOn') : t('auth.updatesOff')
    notificationStore.addNotification({ type: notificationType, message: notificationMessage })
    loading.value = false
  } catch (error) {
    alert(error.statusMessage || error)
    loading.value = false
  }
}
onUnmounted(() => {
  notificationStore.$reset()
})
</script>

<template>
  <v-main>
    <NotificationContainer />
    <v-container v-if="loggedIn">
      <v-row justify="center">
        <v-col cols="12" lg="6" xl="4">
          <p class="text-center text-h5 text-lg-h4">{{ $t('auth.hello') }} {{ user?.email }}</p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
          <AuthForm
            :loading="loading"
            title="auth.changePassword"
            label="auth.newPassword"
            @submit="changePassword"
          />
        </v-col>
        <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
          <AuthForm
            :loading="loading"
            title="auth.changeEmail"
            label="auth.newEmail"
            @submit="changeEmail"
          />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
          <AuthForm
            :loading="loading"
            title="auth.changeUpdateStatus"
            :label="user.wantsUpdates ? 'auth.turnOffUpdates' : 'auth.turnOnUpdates'"
            @submit="changeNotification"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
