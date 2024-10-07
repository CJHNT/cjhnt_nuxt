<script setup>
const parentSearchField = defineModel({ type: String })
</script>

<template>
  <v-col cols="auto">
    <v-radio-group v-model="parentSearchField" inline density="compact" class="text-caption">
      <template #label>
        <div class="text-body-2">{{ $t('search.searchFieldLabel') }}</div>
      </template>
      <v-radio value="text">
        <template #label>
          <div class="text-body-2">Text</div>
        </template>
      </v-radio>
      <v-radio value="belegstellen">
        <template #label>
          <div class="text-body-2">{{ $t('search.belegstellen') }}</div>
        </template></v-radio
      >
    </v-radio-group>
  </v-col>
</template>
