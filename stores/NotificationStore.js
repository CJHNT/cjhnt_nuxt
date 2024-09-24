let nextId = 1

export const useNotificationStore = defineStore('NotificationStore', {
  state: () => {
    return {
      notifications: []
    }
  },
  actions: {
    addNotification(notification) {
      this.notifications.push({ ...notification, id: nextId++ })
    },
    removeNotification(notificationToRemove) {
      console.log(notificationToRemove)
      this.notifications = this.notifications.filter((n) => n.id !== notificationToRemove.id)
    }
  },
  getters: {}
})
