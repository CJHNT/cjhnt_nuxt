<script setup>
const parentSearchSlop = defineModel({ type: Number })
</script>

<template>
  <v-col cols="4" md="4" xxl="3">
    <v-text-field
      v-model="parentSearchSlop"
      density="compact"
      type="number"
      label="Slop"
      variant="outlined"
    >
      <v-tooltip activator="parent" location="start">{{ $t('search.slopTooltip') }}</v-tooltip>
    </v-text-field>
  </v-col>
</template>
