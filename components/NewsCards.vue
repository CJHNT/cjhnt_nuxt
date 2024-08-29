<script setup>
const { locale } = useI18n()
const { data: newsItems } = await useFetch(`/api/plone/news/${locale.value}`)

watch(locale, async (newLocale) => {
  newsItems.value = await $fetch(`/api/plone/news/${newLocale}`)
})
</script>

<template>
  <v-container class="pa-0">
    <v-hover
      v-if="newsItems"
      v-for="item in newsItems.items.slice(0, 3)"
      v-slot="{ isHovering, props }"
    >
      <v-card
        v-bind="props"
        :elevation="isHovering ? 24 : 4"
        class="mx-auto px-6 pb-6 pt-3 news-card"
      >
        <v-card-title class="news-title text-wrap font-weight-black text-subtitle-2">{{
          item.title
        }}</v-card-title>
        <v-card-text class="news-snippet">{{ item.description }}</v-card-text>
        <v-card-text class="py-0"><a :href="item['@id']" target="_blank">Read more</a></v-card-text>
      </v-card>
    </v-hover>
  </v-container>
</template>

<style scoped>
.news-card:hover,
.news-card:focus {
  z-index: 1000;
}
.news-title {
  padding-top: 0;
}
.news-snippet {
  height: 4.2em;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
  padding-bottom: 0px;
}
.news-card {
  margin-bottom: -4em;
}

.news-snippet::after {
  content: '';
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 70%;
  height: 1.2em;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
}
</style>
