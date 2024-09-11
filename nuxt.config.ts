// https://nuxt.com/docs/api/configuration/nuxt-config
import { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path'

export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', href: '/favicon.svg' }]
    }
  },
  devtools: {
    enabled: true,
    vscode: {},
    timeline: {
      enabled: true
    }
  },

  vite: {
    define: {
      global: {}
    },
    vue: { template: { transformAssetUrls } },
    resolve: {
      alias: {
        '#imports': path.resolve(__dirname, '.nuxt/imports')
      }
    }
  },

  modules: [
    '@nuxtjs/google-fonts',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    '@nuxt/devtools'
  ],

  googleFonts: {
    families: {
      'Noto Serif': {
        wght: '100..900',
        ital: '100..200'
      },
      'Noto Serif Hebrew': {
        wght: '100..900'
      },
      'Noto Naskh Arabic': {
        wght: '400..700'
      },
      'Noto Sans Coptic': true,
      'Noto Sans Syriac': {
        wght: '100..900'
      },
      'Noto Serif Armenian': {
        wght: '100..900'
      },
      'Noto Serif Ethiopic': {
        wght: '100..900'
      },
      'Noto Serif Georgian': {
        wght: '100..900'
      }
    },
    display: 'swap'
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    experimental: {
      localeDetector: './localeDetector.ts'
    }
  },

  runtimeConfig: {
    esUrl: process.env.ES_URL,
    esUser: process.env.ES_USER,
    esPw: process.env.ES_PW
  },

  compatibilityDate: '2024-08-07'
})
