<script setup>
import { editTranslations } from '~/utils/abilities'
const { loggedIn, user, fetch } = useUserSession()

await fetch()
const logout = async () => {
  const { csrfToken } = await $fetch('/api/auth/csrf-token')
  await $fetch('/api/_auth/session', {
    method: 'DELETE',
    body: JSON.stringify({
      csrfToken
    })
  })
  window.location.href = '/'
}
</script>

<template>
  <v-app-bar color="#027f42">
    <template #prepend>
      <v-btn class="d-md-none"
        ><v-img
          src="@/assets/img/cjh-logo-quadratisch-klein.png"
          :alt="$t('index.logoAlt')"
          width="32"
          inline
      /></v-btn>
      <v-btn
        icon="mdi-information-outline"
        href="https://cjhnt-info.saw-leipzig.de/de"
        target="_blank"
      />
      <v-btn icon="mdi-home" to="/" />
      <v-tooltip location="bottom" :text="$t('privacy.pageHeader')">
        <template #activator="{ props }">
          <v-btn icon="mdi-security" to="/privacy" v-bind="props" />
        </template>
      </v-tooltip>
    </template>
    <template #append>
      <v-tooltip location="bottom" :text="$t('search.toAdvancedSearch')">
        <template #activator="{ props }">
          <v-btn icon="mdi-magnify" to="/search/advanced" v-bind="props" />
        </template>
      </v-tooltip>

      <template v-if="loggedIn">
        <Can :ability="editTranslations" :args="[user]">
          <v-tooltip location="bottom" :text="$t('admin.translation.editTranslation')">
            <template #activator="{ props }">
              <v-btn icon="mdi-translate" to="/admin/translation" v-bind="props" />
            </template>
          </v-tooltip>
        </Can>
        <v-tooltip location="bottom" :text="$t('auth.loggedInAs', { email: user.email })">
          <template #activator="{ props }">
            <v-btn icon="mdi-account" to="/auth/dashboard" v-bind="props" />
            <v-btn icon="mdi-logout" v-bind="props" @click="logout" />
          </template>
        </v-tooltip>
      </template>
      <v-btn v-else icon="mdi-login" to="/auth/login" />
      <LangSwitcher />
    </template>
  </v-app-bar>
</template>
