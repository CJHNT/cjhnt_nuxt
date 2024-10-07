<script setup>
const props = defineProps({
  notification: { type: Object, required: true }
})
defineEmits(['closeNotification'])
</script>

<template>
  <v-alert
    :type="props.notification.type"
    closable
    density="compact"
    @click:close="$emit('closeNotification')"
  >
    {{ props.notification.message }}
  </v-alert>
</template>
