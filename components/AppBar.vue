<script setup>
const { loggedIn, user, clear, fetch } = useUserSession()

await fetch()
const logout = async () => {
  await clear()
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
    </template>
    <template #append>
      <v-tooltip location="bottom" :text="$t('search.toAdvancedSearch')">
        <template #activator="{ props }">
          <v-btn icon="mdi-magnify" to="/search/advanced" v-bind="props" />
        </template>
      </v-tooltip>

      <template v-if="loggedIn">
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
