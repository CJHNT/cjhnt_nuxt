<script setup>
const parentSearchTerm = defineModel({ type: String })
const searchTerm = ref('')
function sendSearchQuery() {
  if (searchTerm.value) {
    parentSearchTerm.value = searchTerm.value
  }
}
</script>

<template>
  <v-row>
    <v-col>
      <v-responsive class="mx-auto" max-width="344">
        <v-text-field
          v-model="searchTerm"
          :hint="$t('index.searchHint')"
          type="input"
          prepend-inner-icon="mdi-magnify"
          clearable
          @keydown.enter.prevent="sendSearchQuery"
        />
      </v-responsive>
    </v-col>
  </v-row>
</template>
