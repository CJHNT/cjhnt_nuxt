<script setup>
definePageMeta({
  middleware: ['auth']
})
const searchTerm = ref('')
const slop = ref(0)
function submit() {
  if (searchTerm) {
    return navigateTo(
      `/search/results?term=${searchTerm.value.replaceAll(' ', '+')}&slop=${slop.value}&page=1`
    )
  }
}
</script>

<template>
  <v-main>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="3" xl="2">
          <v-card width="100%" class="mx-auto mt-5">
            <v-form @submit.prevent="submit">
              <SearchAdvancedBar v-model="searchTerm" />
              <v-row align="center" justify="center">
                <SearchAdvancedSlop v-model="slop" />
              </v-row>
              <v-card-actions>
                <v-btn color="success" type="submit">Search</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
