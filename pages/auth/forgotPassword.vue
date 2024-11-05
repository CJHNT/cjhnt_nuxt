<script setup>
const notificationStore = useNotificationStore()
const email = ref('')
const { loggedIn } = useUserSession()
if (loggedIn.value) {
  notificationStore.addNotification({
    type: 'warning',
    message: '',
    i18n: 'auth.alreadyLoggedIn',
    link: '/auth/dashboard',
    linkMessage: 'auth.dashboard'
  })
}
// need to create a JWT token to send in the body of the mail.
async function resetPassword() {
  await $fetch('/api/auth/forgotPassword', {
    method: 'POST',
    body: {
      payload: { email: email.value }
    }
  })
  notificationStore.addNotification({
    type: 'info',
    message: '',
    i18n: 'auth.emailSent',
    link: '',
    linkMessage: ''
  })
}
</script>

<template>
  <v-main>
    <NotificationContainer />
    <v-card v-if="!loggedIn" width="400" class="mx-auto mt-5">
      <v-card-title class="text-h5">
        {{ $t('auth.resetPassword') }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="email" label="Email" prepend-icon="mdi-email" />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="info" @click="resetPassword">{{ $t('auth.requestResetEmail') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>
