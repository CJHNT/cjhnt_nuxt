<script setup>
const props = defineProps({
  urn: { type: String, default: '' },
  reff: { type: String, default: '1' }
})
const htmlPath = props.urn.split(':')[3]
const htmlText = (await import(`@/assets/wissensspeicher/${htmlPath}.html?raw`)).default
</script>

<template>
  <v-container class="text-content">
    <v-row>
      <v-col>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="htmlText" />
      </v-col>
    </v-row>
  </v-container>
</template>
