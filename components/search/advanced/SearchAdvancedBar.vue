<script setup>
const parentSearchTerm = defineModel()
</script>

<template>
  <v-text-field
    type="input"
    prepend-inner-icon="mdi-magnify"
    v-model="parentSearchTerm"
    clearable
  ></v-text-field>
</template>
