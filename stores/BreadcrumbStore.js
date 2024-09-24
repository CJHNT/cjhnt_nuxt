let nextId = 1

export const useBreadcrumbStore = defineStore('BreadcrumbStore', {
  state: () => {
    return {
      breadCrumb: []
    }
  },
  actions: {
    addBreadcrumb(crumb) {
      this.breadCrumb.push({ id: nextId++, crumb: crumb })
    },
    removeBreadcrumb(crumbID) {
      this.breadCrumb = this.breadCrumb.filter((c) => c.id !== crumbID)
    }
  },
  getters: {}
})
