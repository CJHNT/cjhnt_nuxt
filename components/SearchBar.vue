<script setup>
const searchTerm = ref('')
function buildSearchParams() {
  if (searchTerm) {
    return navigateTo(`/search/results?term=${searchTerm.value.replace(' ', '+')}&page=1`)
  }
}
</script>

<template>
  <v-row>
    <v-col>
      <v-responsive class="mx-auto" max-width="344">
        <v-text-field
          hint="Hit <Enter> to search"
          type="input"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter.prevent="buildSearchParams"
          v-model="searchTerm"
          clearable
        ></v-text-field>
      </v-responsive>
    </v-col>
  </v-row>
</template>
