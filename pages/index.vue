<script setup>
const { user } = useUserSession()
</script>

<template>
  <v-responsive class="align-center">
    <Footer border="t" />
    <LeftDrawer />

    <v-main class="d-flex justify-center" style="min-height: 300px">
      <v-container>
        <template v-if="!user || user.role === 'user'">
          <v-row justify="center">
            <v-col cols="12" md="8" xl="4">
              <v-alert type="info"
                >We'll be publishing our first texts soon.
                <nuxt-link :to="{ name: 'auth-register' }">Sign up</nuxt-link> for an account if you
                want to be notified.</v-alert
              >
            </v-col>
          </v-row>
        </template>
        <template v-else>
          <SearchBar />
          <CollectionCards />
        </template>
      </v-container>
    </v-main>
  </v-responsive>
</template>
