<script setup>
import primaryImage from '@/assets/img/1_primary_texts.png'
import commentaryImage from '@/assets/img/commentary.jpg'
import infoImage from '@/assets/img/wissen_texts.png'
const { locale } = useI18n()
const { data: theTexts } = await useAsyncData('apiAllTexts', async () => {
  const allTexts = await $fetch('/api/dts/collections', {
    body: { id: 'all_texts' },
    method: 'POST'
  })
  const textPromises = allTexts.member.map(async (m) => {
    const textData = await $fetch('/api/dts/collections', {
      body: { id: m['@id'] },
      method: 'POST'
    })
    const returnObject = {
      id: textData['@id'],
      de: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value'],
      en: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
    }
    return returnObject
  })
  const finishedPromises = await Promise.all(textPromises)
  return finishedPromises.sort((a, b) => a.id.localeCompare(b.id))
})

function getImage(urn) {
  if (urn === '1_primary_texts') {
    return primaryImage
  } else if (urn === 'urn:cts:cjhnt:commentary') {
    return commentaryImage
  } else if (urn === 'wissen_texts') {
    return infoImage
  }
}
</script>

<template>
  <v-row justify="center">
    <v-col v-for="member in theTexts" :key="member.id" cols="auto">
      <figure>
        <figcaption class="text-caption">{{ member[locale] }}</figcaption>
        <nuxt-link
          class="mx-auto"
          :to="`/collection/${member.id.replaceAll(':', '-')}`"
          :title="member[locale]"
        >
          <picture>
            <source media="(max-width: 600px)" :srcset="getImage(member.id)" height="100" />
            <source media="(max-width: 960px)" :srcset="getImage(member.id)" height="130" />
            <source media="(max-width: 1280px)" :srcset="getImage(member.id)" height="160" />
            <img :src="getImage(member.id)" :alt="member[locale]" height="200" />
          </picture>
        </nuxt-link>
      </figure>
    </v-col>
  </v-row>
</template>

<style>
figcaption {
  text-align: center;
}
</style>
