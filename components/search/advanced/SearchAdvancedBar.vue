<script setup>
const parentSearchTerm = defineModel({ type: String })
</script>

<template>
  <v-text-field
    v-model="parentSearchTerm"
    type="input"
    prepend-inner-icon="mdi-magnify"
    clearable
  />
</template>
