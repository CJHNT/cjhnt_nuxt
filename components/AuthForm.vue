<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  title: { type: String, required: true },
  label: { type: String }
})
const emit = defineEmits(['submit'])
const email = ref('')
const repeatEmail = ref('')
const password = ref('')
const repeatPassword = ref('')
const showPassword = ref(false)
const showRepeatPassword = ref(false)
const wantsUpdates = ref(false)

function validateEmail() {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email.value) || 'Invalid e-mail.'
}

function compareEmails() {
  return email.value === repeatEmail.value || 'Emails do not match'
}

function comparePasswords() {
  return password.value === repeatPassword.value || 'Passwords do not match'
}

const submit = () => {
  const payload = {
    email: email.value,
    repeatEmail: repeatEmail.value,
    password: password.value,
    repeatPassword: repeatPassword.value,
    wantsUpdates: wantsUpdates.value
  }
  emit('submit', payload)
}
</script>

<template>
  <v-card width="100%" class="mx-auto mt-5">
    <v-form @submit.prevent="submit">
      <v-card-title class="pb-0 text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-if="['Sign up', 'Change email', 'Login'].includes(title)"
          :label="label ? label : 'Email'"
          :rules="[validateEmail()]"
          prepend-icon="mdi-email"
          v-model="email"
        />
        <v-text-field
          v-if="title === 'Change email'"
          label="Verify email"
          prepend-icon="mdi-email"
          v-model="repeatEmail"
          :rules="[compareEmails()]"
        />
        <v-text-field
          v-if="['Sign up', 'Change password', 'Login'].includes(title)"
          :type="showPassword ? 'text' : 'password'"
          :label="label ? label : 'Password'"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          v-model="password"
        />
        <v-text-field
          v-if="['Sign up', 'Change password'].includes(title)"
          :type="showRepeatPassword ? 'text' : 'password'"
          label="Verify password"
          prepend-icon="mdi-lock"
          :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showRepeatPassword = !showRepeatPassword"
          v-model="repeatPassword"
          :rules="[comparePasswords()]"
        />
        <v-checkbox
          v-if="['Sign up', 'Change update status'].includes(title)"
          v-model="wantsUpdates"
          label="Send me updates about the project"
        ></v-checkbox>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" :disabled="loading" type="submit">
          <template v-if="loading">please wait...</template>
          <template v-else>{{ title }}</template>
        </v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-text>
        <template v-if="title === 'Sign up'">
          Already registered?
          <nuxt-link :to="{ name: 'auth-login' }">Log in</nuxt-link>
        </template>
        <template v-else-if="title === 'Login'">
          Don't have an account yet?
          <nuxt-link :to="{ name: 'auth-register' }">Sign up</nuxt-link>
        </template>
      </v-card-text>
    </v-form>
  </v-card>
</template>
