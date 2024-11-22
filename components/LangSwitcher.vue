<script setup>
const { locale, setLocale } = useI18n()
const { user } = useUserSession()

async function setUserLocale(newLocale) {
  setLocale(newLocale)
  if (user.value.locale) {
    await useAsyncData('changeLocale' + Date.now(), () => {
      const localeChanged = $fetch('/api/auth/changeLocale', {
        method: 'POST',
        body: {
          locale: newLocale
        }
      })
      return localeChanged
    })
  }
}
</script>

<template>
  <v-btn
    v-if="locale === 'de'"
    data-testid="lang-switcher"
    @click.prevent.stop="setUserLocale('en')"
    >en</v-btn
  >
  <v-btn
    v-if="locale === 'en'"
    data-testid="lang-switcher"
    @click.prevent.stop="setUserLocale('de')"
    >de</v-btn
  >
</template>
