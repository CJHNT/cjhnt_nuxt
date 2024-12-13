declare global {
  interface GlobalNotification {
    type: 'error' | 'warning' | 'success' | 'info'
    message: string
    i18n: string
    link: string
    linkMessage: string
  }
}

export {}
