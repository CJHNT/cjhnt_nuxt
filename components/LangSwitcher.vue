<script setup>
const { setLocale, locale } = useI18n()
</script>

<template>
  <v-btn v-if="locale === 'de'" @click="setLocale('en')">en</v-btn>
  <v-btn v-if="locale === 'en'" @click="setLocale('de')">de</v-btn>
</template>
