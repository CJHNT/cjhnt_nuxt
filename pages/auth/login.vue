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
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4" xl="3" xxl="2">
          <AuthForm :loading="loading" @submit="login" title="Login" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
