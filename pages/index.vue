<script setup lang="ts">
const { loggedIn, fetch, user } = useUserSession()
await fetch()
const searchTerm = ref('')

watch(searchTerm, () => {
  if (searchTerm.value) {
    return navigateTo(
      `/search/results?term=${searchTerm.value.replaceAll(' ', '+')}&field=text&page=1`
    )
  }
})
</script>

<template>
  <v-responsive class="align-center">
    <LeftDrawer />
    <AppFooter border="t" />

    <v-main class="d-flex justify-center" style="min-height: 300px">
      <v-container>
        <NotificationContainer />
        <v-row justify="center">
          <v-col cols="auto" class="pb-sm-16">
            <a href="https://cjhnt-info.saw-leipzig.de/de" target="_blank">
              <picture class="d-none d-md-flex">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <source
                  media="(max-width: 960px)"
                  srcset="@/assets/img/Wort-Bildmarke-JF.png"
                  height="180"
                />
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <source
                  media="(max-width: 1280px)"
                  srcset="@/assets/img/Wort-Bildmarke-JF.png"
                  height="180"
                />
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <img
                  src="@/assets/img/Wort-Bildmarke-JF.png"
                  alt="Logo: CJHNT Projekt"
                  height="270"
                />
              </picture>
            </a>
          </v-col>
        </v-row>
        <template v-if="!loggedIn">
          <v-row justify="center">
            <v-col cols="12" md="8" xl="4">
              <v-alert type="info"
                ><i18n-t keypath="index.userAlert">
                  <nuxt-link :to="{ name: 'auth-register' }">{{ $t('index.signUp') }}</nuxt-link>
                </i18n-t></v-alert
              >
            </v-col>
          </v-row>
        </template>
        <template v-else-if="user && !['project', 'admin'].includes(user.role)">
          <v-row justify="center">
            <v-col cols="12" md="8" xl="4">
              <v-alert type="info"
                ><i18n-t keypath="index.projectAlert">
                  <nuxt-link :to="{ name: 'auth-dashboard' }">{{ $t('auth.dashboard') }}</nuxt-link>
                </i18n-t></v-alert
              >
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <SearchBar v-model="searchTerm" />
          <CollectionCards />
        </template>
      </v-container>
    </v-main>
  </v-responsive>
</template>
