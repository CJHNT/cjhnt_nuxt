<script setup>
import './assets/main.css'
// const theme = ref('light')
// function toggleTheme() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
const nuxtApp = useNuxtApp()
const loading = ref(false)
const { setLocale } = useI18n()
const { user } = useUserSession()
await setLocale(user.value?.locale || 'en')
nuxtApp.hook('page:start', () => {
  loading.value = true
})

nuxtApp.hook('page:finish', () => {
  loading.value = false
})
</script>

<template>
  <NuxtLayout>
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
    </v-overlay>
    <NuxtPage />
  </NuxtLayout>
</template>
