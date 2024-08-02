<script setup>
defineProps({
  collId: {
    type: String,
    required: true,
    default: ''
  },
  collName: {
    type: String,
    required: true,
    default: ''
  }
})
</script>

<template>
  <div>
    <button>{{ collName }}</button>
    <p v-if="pending">Loading...</p>
    <CollectionDropdownContent v-else v-for="member in data.member" :key="member['@id']">{{
      member.title
    }}</CollectionDropdownContent>
  </div>
</template>
