<script setup>
const { locale } = useI18n()
const { data: theTexts } = await useAsyncData('apiAllTexts', async () => {
  const allTexts = await $fetch('http://127.0.0.1:5000/api/dts/collections', {
    query: { id: 'all_texts' }
  })
  const textPromises = allTexts.member.map(async (m) => {
    const { data: textData } = await useFetch('http://127.0.0.1:5000/api/dts/collections', {
      query: { id: m['@id'] }
    })
    const returnObject = {
      id: textData.value['@id'],
      de: textData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')[
        '@value'
      ],
      en: textData.value['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')[
        '@value'
      ]
    }
    return returnObject
  })
  const finishedPromises = await Promise.all(textPromises)
  return finishedPromises
})
const sortedMembers = computed(() => {
  return [...theTexts.value].sort((a, b) => a.id.localeCompare(b.id))
})
import primaryImage from '@/assets/img/1_primary_texts.png'
import commentaryImage from '@/assets/img/commentary.jpg'

function getImage(urn) {
  if (urn === '1_primary_texts') {
    return primaryImage
  } else if (urn === 'urn:cts:cjhnt:commentary') {
    return commentaryImage
  }
}
</script>

<template>
  <v-row justify="center">
    <v-col v-for="member in sortedMembers" :key="member.id" cols="auto">
      <template>
        <nuxt-link class="mx-auto" :to="`/collection/${member.id}`" :title="member[locale]">
          <picture>
            <source media="(max-width: 600px)" :srcset="getImage(member.id)" height="100" />
            <source media="(max-width: 960px)" :srcset="getImage(member.id)" height="130" />
            <source media="(max-width: 1280px)" :srcset="getImage(member.id)" height="160" />
            <img :src="getImage(member.id)" :alt="member[locale]" height="200" />
          </picture>
        </nuxt-link>
      </template>
    </v-col>
  </v-row>
</template>
