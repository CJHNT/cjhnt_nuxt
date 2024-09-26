<script setup>
import AuthForm from '@/components/AuthForm.vue'

const { loggedIn, user, fetch } = useUserSession()
const loading = ref(false)
const router = useRouter()
const notificationStore = useNotificationStore()
const { t } = useI18n()

fetch()

const changeEmail = async (body) => {
  loading.value = true
  try {
    await $fetch('/api/auth/changeEmail', {
      method: 'POST',
      body
    })
    fetch()
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
  try {
    await $fetch('/api/auth/changePassword', {
      method: 'POST',
      body
    })
    fetch()
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
  try {
    await $fetch('/api/auth/changeNotification', {
      method: 'POST',
      body
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
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="6" xl="4">
          <p v-if="loggedIn" class="text-center text-h5 text-lg-h4">
            {{ $t('auth.hello') }} {{ user?.email }}
          </p>
          <v-alert v-else type="info" closable>
            <i18n-t keypath="auth.pleaseLogin">
              <nuxt-link :to="{ name: 'auth-login' }">{{ $t('auth.pleaseLoginLink') }}</nuxt-link>
            </i18n-t>
          </v-alert>
        </v-col>
      </v-row>
      <template v-if="loggedIn">
        <v-row justify="center">
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changePassword"
              title="auth.changePassword"
              label="auth.newPassword"
            />
          </v-col>
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changeEmail"
              title="auth.changeEmail"
              label="auth.newEmail"
            />
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changeNotification"
              title="auth.changeUpdateStatus"
              :label="user.wantsUpdates ? 'auth.turnOffUpdates' : 'auth.turnOnUpdates'"
            />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-main>
</template>
