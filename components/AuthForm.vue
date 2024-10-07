<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  title: { type: String, required: true },
  label: { type: String, default: '' }
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
      <v-card-title class="pb-0 text-h5">{{ $t(title) }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-if="['auth.signUp', 'auth.changeEmail', 'auth.login'].includes(title)"
          v-model="email"
          :label="label ? $t(label) : 'Email'"
          :rules="[validateEmail()]"
          prepend-icon="mdi-email"
        />
        <v-text-field
          v-if="title === 'auth.changeEmail'"
          v-model="repeatEmail"
          :label="$t('auth.verifyEmail')"
          prepend-icon="mdi-email"
          :rules="[() => email === repeatEmail || $t('auth.noEmailMatch')]"
        />
        <v-text-field
          v-if="['auth.signUp', 'auth.changePassword', 'auth.login'].includes(title)"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :label="label ? $t(label) : $t('auth.password')"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          v-if="['auth.signUp', 'auth.changePassword'].includes(title)"
          v-model="repeatPassword"
          :type="showRepeatPassword ? 'text' : 'password'"
          :label="$t('auth.verifyPassword')"
          prepend-icon="mdi-lock"
          :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[() => password === repeatPassword || $t('auth.noPasswordMatch')]"
          @click:append="showRepeatPassword = !showRepeatPassword"
        />
        <v-checkbox
          v-if="['auth.signUp'].includes(title)"
          v-model="wantsUpdates"
          :label="label ? $t(label) : $t('auth.sendMeUpdates')"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="success" :disabled="loading" type="submit">
          <template v-if="loading">{{ $t('wait') }}</template>
          <template v-else-if="title === 'auth.changeUpdateStatus'">{{ $t(label) }}</template>
          <template v-else>{{ $t(title) }}</template>
        </v-btn>
      </v-card-actions>
      <template v-if="['auth.signUp', 'auth.login'].includes(title)">
        <v-divider />
        <v-card-text>
          <template v-if="title === 'auth.signUp'">
            {{ $t('auth.alreadyRegistered') }}
            <nuxt-link :to="{ name: 'auth-login' }">{{ $t('auth.login') }}</nuxt-link>
          </template>
          <template v-else-if="title === 'auth.login'">
            {{ $t('auth.noAccountYet') }}
            <nuxt-link :to="{ name: 'auth-register' }">{{ $t('auth.signUp') }}</nuxt-link>
          </template>
        </v-card-text>
      </template>
    </v-form>
  </v-card>
</template>
