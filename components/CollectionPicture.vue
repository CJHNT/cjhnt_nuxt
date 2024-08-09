<script setup>
const props = defineProps({ filename: String, memberName: String })
</script>

<template>
  <picture class="d-none d-md-flex">
    <source media="(max-width: 960px)" :srcset="filename" height="180" />
    <source media="(max-width: 1280px)" :srcset="filename" height="180" />
    <img :src="filename" :alt="memberName" height="270" />
  </picture>
</template>
