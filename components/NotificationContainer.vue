<script setup>
const notifications = useNotificationStore()
</script>

<template>
  <v-container v-if="notifications.notifications.length > 0">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4">
        <div class="notification-container">
          <NotificationBar
            v-for="notification in notifications.notifications"
            :key="notification.id"
            :notification="notification"
            @close-notification="notifications.removeNotification(notification)"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
