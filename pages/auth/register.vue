<script setup>
import AuthForm from '@/components/AuthForm.vue'

const loading = ref(false)
const router = useRouter()

const register = async (body) => {
  loading.value = true
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body
    })
    router.push({ name: 'index' })
    loading.value = false
  } catch (error) {
    alert(error.statusMessage || error)
    loading.value = false
  }
}
</script>

<template>
  <v-main>
    <AuthForm :loading="loading" @submit="register" title="Sign up" />
  </v-main>
</template>
