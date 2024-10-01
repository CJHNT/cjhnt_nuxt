<script setup>
import './assets/main.css'
// const theme = ref('light')
// function toggleTheme() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
</script>

<template>
  <v-app class="rounded rounded-md">
    <AppBar />
    <NotificationContainer />
    <slot />
  </v-app>
</template>
