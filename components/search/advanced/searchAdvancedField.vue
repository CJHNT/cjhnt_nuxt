<script setup>
const parentSearchField = defineModel()
</script>

<template>
  <v-col cols="auto">
    <v-radio-group inline v-model="parentSearchField" density="compact" class="text-caption">
      <template v-slot:label>
        <div class="text-body-2">{{ $t('search.searchFieldLabel') }}</div>
      </template>
      <v-radio value="text">
        <template v-slot:label>
          <div class="text-body-2">Text</div>
        </template>
      </v-radio>
      <v-radio value="belegstellen">
        <template v-slot:label>
          <div class="text-body-2">{{ $t('search.belegstellen') }}</div>
        </template></v-radio
      >
    </v-radio-group>
  </v-col>
</template>
