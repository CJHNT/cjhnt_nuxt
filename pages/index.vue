<script setup>
const { user, fetch } = useUserSession()
fetch()
const searchTerm = ref('')

watch(searchTerm, () => {
  if (searchTerm) {
    return navigateTo(
      `/search/results?term=${searchTerm.value.replaceAll(' ', '+')}&field=text&page=1`
    )
  }
})
</script>

<template>
  <v-responsive class="align-center">
    <LeftDrawer />
    <Footer border="t" />

    <v-main class="d-flex justify-center" style="min-height: 300px">
      <v-container>
        <v-row justify="center">
          <v-col cols="auto" class="pb-sm-16">
            <a href="https://cjhnt-info.saw-leipzig.de/de" target="_blank">
              <picture class="d-none d-md-flex">
                <source
                  media="(max-width: 960px)"
                  srcset="@/assets/img/Wort-Bildmarke-JF.png"
                  height="180"
                />
                <source
                  media="(max-width: 1280px)"
                  srcset="@/assets/img/Wort-Bildmarke-JF.png"
                  height="180"
                />
                <img
                  src="@/assets/img/Wort-Bildmarke-JF.png"
                  alt="Logo: CJHNT Projekt"
                  height="270"
                />
              </picture>
            </a>
          </v-col>
        </v-row>
        <template v-if="!user || user.role === 'user'">
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
        <template v-else>
          <SearchBar v-model="searchTerm" />
          <CollectionCards />
        </template>
      </v-container>
    </v-main>
  </v-responsive>
</template>
