<script setup lang="ts">
import { defineProps } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps({
  error: { type: Object as () => NuxtError, default: () => {} }
})
const notificationStore = useNotificationStore()

if (props.error.statusCode === 401) {
  notificationStore.addNotification({
    type: 'error',
    message: '',
    i18n: props.error.message,
    link: '/auth/login',
    linkMessage: 'auth.login'
  })
  clearError()
} else if (props.error.statusCode === 403) {
  notificationStore.addNotification({
    type: 'error',
    message: '',
    i18n: props.error.message,
    link: '/',
    linkMessage: 'Home'
  })
  clearError()
}
notificationStore.addNotification({
  type: 'error',
  message: '',
  i18n: 'uncaughtError',
  link: '/',
  linkMessage: 'Home'
})
clearError()
</script>

<template>
  <div>
    <NotificationContainer />
    <h1>{{ error.statusCode }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
