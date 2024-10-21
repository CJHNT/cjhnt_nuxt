import { useLocalStorage } from '@vueuse/core'
let nextId = 1

export const useNotificationStore = defineStore('NotificationStore', {
  state: () => {
    return {
      notifications: useLocalStorage('notifications', [])
    }
  },
  hydrate(state) {
    state.notifications = useLocalStorage('notifications', [])
  },
  actions: {
    addNotification(notification) {
      this.notifications.push({ ...notification, id: nextId++ })
    },
    removeNotification(notificationToRemove) {
      this.notifications = this.notifications.filter((n) => n.id !== notificationToRemove.id)
    }
  },
  getters: {}
})
