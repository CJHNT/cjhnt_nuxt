<script setup>
import AuthForm from '@/components/AuthForm.vue'
import zxcvbn from 'zxcvbn'

const loading = ref(false)
const router = useRouter()
const alertMessage = ref({ type: '', message: '' })

function validateEmail(email) {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email)
}

const register = async (body) => {
  loading.value = true
  const passwordFeedback = zxcvbn(body.password)
  if (!validateEmail(body.email)) {
    alertMessage.value.type = 'error'
    alertMessage.value.message = 'auth.invalidEmail'
    loading.value = false
  } else if (!body.password) {
    alertMessage.value.type = 'error'
    alertMessage.value.message = 'auth.emptyPassword'
    loading.value = false
  } else if (body.password !== body.repeatPassword) {
    alertMessage.value.type = 'error'
    alertMessage.value.message = 'auth.noPasswordMatch'
    loading.value = false
  } else if (passwordFeedback.score < 2) {
    alertMessage.value.type = 'error'
    alertMessage.value.message = `${passwordFeedback.feedback.warning ? passwordFeedback.feedback.warning : 'auth.weakPasswordAlert'}: ${passwordFeedback.feedback.suggestions.join('; ')}`
    loading.value = false
  } else {
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
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4" xl="3" xxl="2">
          <AuthForm :loading="loading" title="auth.signUp" @submit="register" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
