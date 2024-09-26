<script setup>
definePageMeta({
  middleware: ['auth']
})
const route = useRoute()

const { user } = useUserSession()
const { locale } = useI18n()
const collName = ref({})
const ancestors = ref([])

const { data, pending } = await useAsyncData('apiAllTexts', async () => {
  const allTexts = await $fetch('/api/dts/collections', {
    body: { id: route.params.collid },
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
  let hasParent =
    allTexts['dts:dublincore'] && allTexts['dts:dublincore']['dct:isPartOf']
      ? allTexts['dts:dublincore']['dct:isPartOf'][0]['@id']
      : false
  while (hasParent) {
    const parentInfo = await $fetch('/api/dts/collections', {
      body: { id: allTexts['dts:dublincore']['dct:isPartOf'][0]['@id'] },
      method: 'POST'
    })
    const parentTitle = {
      de: parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
        ? parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
        : parentInfo.title,
      en: parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
        ? parentInfo['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
        : parentInfo.title
    }
    ancestors.value.unshift({ id: parentInfo['@id'], title: parentTitle })
    hasParent =
      parentInfo['dts:dublincore'] && parentInfo['dts:dublincore']['dct:isPartOf']
        ? parentInfo['dts:dublincore']['dct:isPartOf'][0]['@id']
        : false
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
    <v-main class="d-flex justify-center" style="min-height: 300px">
      <v-container v-if="user?.role === 'user'" class="text-column">
        <v-alert type="warning"
          >{{ $t('auth.onlyProject') }} <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
        >
      </v-container>
      <div v-else class="collection-list">
        <Breadcrumb v-if="ancestors.length > 0" :ancestors="ancestors" :index="0"></Breadcrumb>

        <h1>{{ collName[locale] }}</h1>
        <ul class="collection-list">
          <li v-if="pending">{{ $t('loading') }}</li>
          <li v-else v-for="member in sortedMembers" :key="member.id" class="col-link">
            <nuxt-link v-if="member.type === 'Resource'" :to="`/texts/${member.id}`">{{
              member[locale]
            }}</nuxt-link>
            <nuxt-link v-else :to="`/collection/${member.id}`">{{ member[locale] }}</nuxt-link>
          </li>
        </ul>
      </div>
    </v-main>
  </v-responsive>
</template>
