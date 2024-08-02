<script setup>
const { data, pending } = await useFetch('http://127.0.0.1:5000/api/dts/collections')
</script>

<template>
  <h1>Collections</h1>
  <v-list lines="false">
    <v-list-item v-if="pending" title="Loading..."></v-list-item>
    <v-list-item v-else v-for="member in data.member" :key="member['@id']" class="col-link">
      <NuxtLink :to="`/collection/${member['@id']}`">{{ member.title }}</NuxtLink>
    </v-list-item>
  </v-list>
</template>
