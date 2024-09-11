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
    alertMessage.value.message = 'auth.emailChanged'
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
    alertMessage.value.message = 'auth.passwordChanged'
    loading.value = false
  } catch (error) {
    console.log({ error })
    alert(error.statusMessage || error)
    loading.value = false
  }
}
const changeNotification = async (body) => {
  loading.value = true
  try {
    await $fetch('/api/auth/changeNotification', {
      method: 'POST',
      body
    })
    await fetch()
    router.push({ name: 'auth-dashboard' })
    alertMessage.value.type = 'success'
    alertMessage.value.message =
      user.value.wantsUpdates === true ? 'auth.updatesOn' : 'auth.updatesOff'
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
            :text="$t(alertMessage.message)"
            closable
          ></v-alert>
          <p v-if="loggedIn" class="text-center text-h5 text-lg-h4">
            {{ $t('auth.hello') }} {{ user?.email }}
          </p>
          <v-alert v-else type="info" closable>
            <i18n-t keypath="auth.pleaseLogin">
              <nuxt-link :to="{ name: 'auth-login' }">{{ $t('auth.pleaseLoginLink') }}</nuxt-link>
            </i18n-t>
          </v-alert>
        </v-col>
      </v-row>
      <template v-if="loggedIn">
        <v-row justify="center">
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changePassword"
              title="auth.changePassword"
              label="auth.newPassword"
            />
          </v-col>
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changeEmail"
              title="auth.changeEmail"
              label="auth.newEmail"
            />
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="5" xl="3" xxl="2">
            <AuthForm
              :loading="loading"
              @submit="changeNotification"
              title="auth.changeUpdateStatus"
              :label="user.wantsUpdates ? 'auth.turnOffUpdates' : 'auth.turnOnUpdates'"
            />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </v-main>
</template>
