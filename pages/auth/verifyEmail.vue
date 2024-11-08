<script setup>
definePageMeta({
  middleware: ['auth']
})

const { user, fetch } = useUserSession()
await fetch()
const authorized = useState('authorized')
const notificationStore = useNotificationStore()

if (authorized.value && !user.value.verifiedEmail) {
  verifyEmail()
}

async function verifyEmail() {
  await $fetch('/api/auth/sendEmailVerification', {
    method: 'POST',
    body: {
      payload: { email: user.value.email }
    }
  })
  notificationStore.addNotification({
    type: 'info',
    message: '',
    i18n: 'auth.emailVerification.emailSentNotification',
    link: '',
    linkMessage: ''
  })
}
</script>

<template>
  <v-main>
    <NotificationContainer />
    <v-card v-if="user.verifiedEmail" width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>{{ $t('auth.emailVerification.verificationPage.header') }}</h1>
      </v-card-title>
      <v-card-text>{{
        $t('auth.emailVerification.verificationPage.alreadyVerified', { email: user.email })
      }}</v-card-text>
    </v-card>
    <v-card v-else-if="authorized" width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>{{ $t('auth.emailVerification.verificationPage.header') }}</h1>
      </v-card-title>
      <v-card-text>{{
        $t('auth.emailVerification.verificationPage.message', { email: user.email })
      }}</v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="info" @click="verifyEmail">{{
          $t('auth.emailVerification.verificationPage.header')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>
