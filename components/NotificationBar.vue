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
    {{ props.notification.i18n ? $t(props.notification.i18n) : props.notification.message }}
    <nuxt-link v-if="props.notification.link" :to="props.notification.link">{{
      $t(props.notification.linkMessage)
    }}</nuxt-link>
  </v-alert>
</template>
