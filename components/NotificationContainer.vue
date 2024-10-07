<script setup>
const notifications = useNotificationStore()
</script>

<template>
  <v-main v-if="notifications.notifications.length > 0" class="pb-0">
    <v-container>
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
  </v-main>
</template>
