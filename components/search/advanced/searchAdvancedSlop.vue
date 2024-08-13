<script setup>
const parentSearchSlop = defineModel()
</script>

<template>
  <v-col cols="3">
    <v-text-field
      v-model="parentSearchSlop"
      density="compact"
      type="number"
      label="Slop"
      variant="outlined"
    >
      <v-tooltip activator="parent" location="start">Maximum distance between words</v-tooltip>
    </v-text-field>
  </v-col>
</template>
