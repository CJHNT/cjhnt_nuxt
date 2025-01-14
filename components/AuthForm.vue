<script setup>
import zxcvbn from 'zxcvbn'
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
const { t } = useI18n()

function validateEmail() {
  const pattern = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  return pattern.test(email.value) || 'Invalid e-mail.'
}

function passwordStrength() {
  const strength = zxcvbn(password.value)
  return strength.score > 1 || t('auth.weakPassword')
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

const passwordStrengthPercent = computed(() => zxcvbn(password.value).score * 25)
const strengthColor = computed(
  () =>
    ['error', 'error', 'warning', 'success', 'success'][
      Math.floor(passwordStrengthPercent.value / 25)
    ]
)
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
          data-testid="email-input"
          prepend-icon="mdi-email"
        />
        <v-text-field
          v-if="title === 'auth.changeEmail'"
          v-model="repeatEmail"
          :label="$t('auth.verifyEmail')"
          data-testid="repeat-email-input"
          prepend-icon="mdi-email"
          :rules="[() => email === repeatEmail || $t('auth.noEmailMatch')]"
        />
        <v-text-field
          v-if="['auth.signUp', 'auth.changePassword', 'auth.login'].includes(title)"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          :label="label ? $t(label) : $t('auth.password')"
          :rules="title !== 'auth.login' ? [passwordStrength()] : []"
          data-testid="password-input"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        >
          <template v-if="title !== 'auth.login'" #loader>
            <v-progress-linear
              v-model="passwordStrengthPercent"
              :color="strengthColor"
              height="10"
            />
          </template>
        </v-text-field>
        <v-text-field
          v-if="['auth.signUp', 'auth.changePassword'].includes(title)"
          v-model="repeatPassword"
          :type="showRepeatPassword ? 'text' : 'password'"
          :label="$t('auth.verifyPassword')"
          data-testid="repeat-password-input"
          prepend-icon="mdi-lock"
          :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[() => password === repeatPassword || $t('auth.noPasswordMatch')]"
          @click:append="showRepeatPassword = !showRepeatPassword"
        />
        <v-checkbox
          v-if="['auth.signUp'].includes(title)"
          v-model="wantsUpdates"
          data-testid="updates-checkbox"
          :label="label ? $t(label) : $t('auth.sendMeUpdates')"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="success" :disabled="loading" type="submit" data-testid="submit-button">
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
            <nuxt-link :to="{ name: 'auth-login' }" data-testid="login-link">{{
              $t('auth.login')
            }}</nuxt-link>
          </template>
          <template v-else-if="title === 'auth.login'">
            <p>
              {{ $t('auth.noAccountYet') }}
              <nuxt-link :to="{ name: 'auth-register' }" data-testid="signup-link">{{
                $t('auth.signUp')
              }}</nuxt-link>
            </p>
            <p>
              {{ $t('auth.forgotPassword') }}
              <nuxt-link to="/auth/forgotPassword" data-testid="forgot-password-link">{{
                $t('auth.resetPassword')
              }}</nuxt-link>
            </p>
          </template>
        </v-card-text>
      </template>
    </v-form>
  </v-card>
</template>
