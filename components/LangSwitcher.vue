<script setup>
const { setLocale, locale } = useI18n()
</script>

<template>
  <v-btn v-if="locale === 'de'" @click.prevent.stop="setLocale('en')">en</v-btn>
  <v-btn v-if="locale === 'en'" @click.prevent.stop="setLocale('de')">de</v-btn>
</template>
