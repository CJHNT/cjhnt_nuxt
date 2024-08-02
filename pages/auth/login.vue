<script setup>
import AuthForm from '@/components/AuthForm.vue'

const loading = ref(false)
const router = useRouter()

const login = async (body) => {
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body
    })
    router.push({ name: 'auth-dashboard' })
    loading.value = false
  } catch (error) {
    console.log({ error })
    alert(error.statusMessage || error)
    loading.value = false
  }
}
</script>

<template>
  <v-main>
    <AuthForm :loading="loading" @submit="login" title="Login" />
  </v-main>
</template>
