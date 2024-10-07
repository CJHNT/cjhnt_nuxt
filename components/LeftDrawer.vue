<script setup>
const rail = ref(false)
const barTemporary = ref(false)

onMounted(() => {
  if (window.innerWidth < 1280) {
    rail.value = true
    barTemporary.value = true
  }
})
</script>

<template>
  <v-navigation-drawer
    :rail="rail"
    width="500"
    mobile-breakpoint="xs"
    rail-width="30"
    @click="rail = false"
  >
    <v-container class="px-0 fill-height">
      <v-row no-gutters class="fill-height">
        <v-col v-if="!rail" class="fill-height">
          <v-container class="fill-height">
            <v-row class="h-50">
              <v-col cols="12" align-self="center">
                <p class="text-body-2 text-xl-body-1">
                  <i18n-t keypath="index.introBlurb">
                    <nuxt-link :to="{ name: 'auth-register' }">{{
                      $t('index.register')
                    }}</nuxt-link>
                  </i18n-t>
                </p>
              </v-col>
            </v-row>
            <v-row class="h-50">
              <v-col class="pt-0">
                <NewsCards />
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-btn
            density="compact"
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            @click.stop="rail = !rail"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>
