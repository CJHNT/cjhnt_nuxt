<script setup>
import AuthForm from '@/components/AuthForm.vue'

const alertMessage = ref({ type: '', message: '' })
const { loggedIn, user, fetch } = useUserSession()
const loading = ref(false)
const router = useRouter()

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
    alertMessage.value.type = 'success'
    alertMessage.value.message = 'Email successfully changed.'
    loading.value = false
  } catch (error) {
    console.log({ error })
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
    alertMessage.value.type = 'success'
    alertMessage.value.message = 'Password successfully changed.'
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
        <v-col cols="12" lg="6" xl="4">
          <v-alert
            v-if="alertMessage.message"
            :type="alertMessage.type"
            :text="alertMessage.message"
            closable
          ></v-alert>
          <p v-if="loggedIn" class="text-center text-h5 text-lg-h4">Hello {{ user?.email }}</p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <template v-if="loggedIn">
          <v-col cols="12" sm="6" md="4" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changePassword"
              title="Change password"
              label="New password"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changeEmail"
              title="Change email"
              label="New email"
            />
          </v-col>
        </template>
        <template v-else>
          <p>Please <nuxt-link :to="{ name: 'auth-login' }">log in</nuxt-link> to view this page</p>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>
