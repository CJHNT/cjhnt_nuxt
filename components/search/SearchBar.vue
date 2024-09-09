<script setup>
const parentSearchTerm = defineModel()
const searchTerm = ref('')
function sendSearchQuery() {
  if (searchTerm) {
    parentSearchTerm.value = searchTerm.value
  }
}
</script>

<template>
  <v-row>
    <v-col>
      <v-responsive class="mx-auto" max-width="344">
        <v-text-field
          :hint="$t('index.searchHint')"
          type="input"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter.prevent="sendSearchQuery"
          v-model="searchTerm"
          clearable
        ></v-text-field>
      </v-responsive>
    </v-col>
  </v-row>
</template>
