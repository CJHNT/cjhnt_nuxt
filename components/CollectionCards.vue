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
</script>

<template>
  <v-row justify="center">
    <v-col v-for="member in theTexts" :key="member.id" cols="10" sm="4" xl="3" xxl="2">
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          :elevation="isHovering ? 24 : 4"
          class="mx-auto"
          :to="`/collection/${member.id}`"
          ><v-card-title class="text-wrap text-subtitle-2 text-md-h6">{{
            member[locale]
          }}</v-card-title>
        </v-card>
      </v-hover></v-col
    >
  </v-row>
</template>
