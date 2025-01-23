import VueMatomo from 'vue-matomo'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    router: nuxtApp.$router,
    host: nuxtApp.$config.public.matomoHost,
    siteId: nuxtApp.$config.public.matomoSiteId,
    disableCookies: true,
    trackSiteSearch: (to) => {
      if (to.query.term && to.name === 'search-results') {
        const keyword = Object.entries(to.query).map(([key, value]) => {
          if (!['page', 'field'].includes(key)) {
            return `${key}=${value}`
          }
        })
        return { keyword: keyword.join('&'), category: to.query.field }
      }
    }
  })
})
