<script setup>
import './assets/main.css'
// const theme = ref('light')
// function toggleTheme() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
const nuxtApp = useNuxtApp()
const loading = ref(false)
nuxtApp.hook('page:start', () => {
  loading.value = true
})

nuxtApp.hook('page:finish', () => {
  loading.value = false
})
</script>

<template>
  <v-app class="rounded rounded-md">
    <AppBar />
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <NotificationContainer />
    <slot />
  </v-app>
</template>
