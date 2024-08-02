<script setup>
const rail = ref(false)
</script>

<template>
  <v-navigation-drawer :rail="rail" @click="rail = false" width="500">
    <v-container class="pr-0 fill-height">
      <v-row no-gutters class="fill-height">
        <v-col v-if="!rail" class="fill-height">
          <v-container class="fill-height">
            <v-row class="h-50">
              <v-col cols="12" align-self="center">
                <p class="text-body-2 text-xl-body-1">
                  Welcome to the CJHNT research platform! All of our texts, both the commentaries
                  produced in the project and the early Jewish texts that they depend on, will be
                  published here. We will also have advanced search functionality to allow you to do
                  your own research on our corpus. To use the platform you will need to
                  <nuxt-link :to="{ name: 'auth-register' }">register for an account</nuxt-link>.
                  During the registration process you can also sign up to receive updates about new
                  texts and new functionality.
                </p>
              </v-col>
            </v-row>
            <v-row class="h-50">
              <v-col>
                <NewsCards />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-btn
            density="compact"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            @click.stop="rail = !rail"
            variant="text"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>
