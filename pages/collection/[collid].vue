<script setup>
definePageMeta({
  middleware: ['auth']
})
import { useParam } from '~/composables/useParam'

const { user } = useUserSession()
const { locale } = useI18n()
const collName = ref({})
const { data, pending } = await useAsyncData('apiAllTexts', async () => {
  const allTexts = await $fetch('/api/dts/collections', {
    body: { id: useParam('collid') },
    method: 'POST'
  })
  collName.value = {
    de: allTexts['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
      ? allTexts['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
      : allTexts.title,
    en: allTexts['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
      ? allTexts['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
      : allTexts.title
  }
  if (allTexts.totalItems < 100) {
    const textPromises = allTexts.member.map(async (m) => {
      const textData = await $fetch('/api/dts/collections', {
        body: { id: m['@id'] },
        method: 'POST'
      })
      const returnObject = {
        id: textData['@id'],
        de: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
          ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
          : m.title,
        en: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
          ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
          : m.title,
        type: textData['@type']
      }
      return returnObject
    })
    const finishedPromises = await Promise.all(textPromises)
    return finishedPromises
  } else {
    const returnValue = allTexts.member.map((m) => {
      const returnObject = { id: m['@id'], de: m.title, en: m.title, type: m['@type'] }
      return returnObject
    })
    return returnValue
  }
})

const sortedMembers = computed(() => {
  return [...data.value].sort((a, b) => a.id.localeCompare(b.id))
})
</script>

<template>
  <v-responsive class="align-center">
    <Footer />
    <v-container v-if="user?.role === 'user'">
      <v-alert type="warning"
        >This page is only available to project members.
        <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
      >
    </v-container>
    <v-main v-else class="d-flex justify-center" style="min-height: 300px">
      <div class="collection-list">
        <h1>{{ collName[locale] }}</h1>
        <ul class="collection-list">
          <li v-if="pending">Loading...</li>
          <li v-else v-for="member in sortedMembers" :key="member.id" class="col-link">
            <nuxt-link v-if="member.type === 'Resource'" :to="`/comptexts/${member.id}`">{{
              member[locale]
            }}</nuxt-link>
            <nuxt-link v-else :to="`/collection/${member.id}`">{{ member[locale] }}</nuxt-link>
          </li>
        </ul>
      </div>
    </v-main>
  </v-responsive>
</template>
