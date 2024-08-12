<script setup>
const props = defineProps({ urn: String, reff: { type: String, default: 1 } })
const htmlPath = props.urn.split(':')[3]
const htmlText = (await import(`@/assets/wissensspeicher/${htmlPath}.html?raw`)).default
console.log('Text', htmlText)
</script>

<template>
  <v-container class="text-content" v-html="htmlText"></v-container>
</template>
