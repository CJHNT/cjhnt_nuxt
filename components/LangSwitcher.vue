<script setup>
const { setLocale } = useI18n()
</script>

<template>
  <v-btn @click="setLocale('en')">en</v-btn>|
  <v-btn @click="setLocale('de')">de</v-btn>
</template>
