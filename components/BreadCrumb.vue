<script setup>
const props = defineProps({
  ancestors: { type: Array, required: true },
  index: { type: Number, required: true }
})
const { locale } = useI18n()
</script>

<template>
  <v-breadcrumbs :items="props.ancestors" class="py-0">
    <template #item="{ item }">
      <span v-if="item.disabled">{{ item.title[locale] }} {{ item.ref }}</span>
      <nuxt-link v-else :to="`/collection/${item.id}`">{{ item.title[locale] }}</nuxt-link>
    </template>
    <template #prepend>
      <v-icon v-if="index > 0" icon="mdi-subdirectory-arrow-right" size="small"/>
      <!-- <v-icon v-else icon="mdi-slash-forward" size="small"></v-icon> -->
      <span v-else class="pr-2">/</span>
    </template>
  </v-breadcrumbs>
</template>
