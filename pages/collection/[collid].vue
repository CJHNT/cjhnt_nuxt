<script setup>
definePageMeta({
  middleware: ['auth']
})
const route = useRoute()

const { user } = useUserSession()
const { locale } = useI18n()
const collName = ref({})
const ancestors = ref([])
const collectionLists = useState('collList')
console.log(collectionLists.value[route.params.collid])

const { data: parentInfo } = await useFetch('/api/dts/collections', {
  body: { id: '1_primary_texts' },
  method: 'POST'
})
const parentTitle = {
  de: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
    ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
    : parentInfo.value.title,
  en: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
    ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
    : parentInfo.value.title
}
ancestors.value.push({ id: '1_primary_texts', title: parentTitle })

const { data: allTexts } = await useFetch('/api/dts/collections', {
  body: { id: route.params.collid },
  method: 'POST'
})

collName.value = {
  de: allTexts.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
    ? allTexts.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
    : allTexts.value.title,
  en: allTexts.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
    ? allTexts.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
    : allTexts.value.title
}
// let hasParent = false
// if (allTexts.value['dts:dublincore'] && allTexts.value['dts:dublincore']['dct:isPartOf']) {
//   if (typeof allTexts.value['dts:dublincore']['dct:isPartOf'] === 'string') {
//     hasParent = allTexts.value['dts:dublincore']['dct:isPartOf']
//   } else if (Array.isArray(allTexts.value['dts:dublincore']['dct:isPartOf'])) {
//     hasParent = allTexts.value['dts:dublincore']['dct:isPartOf'][0]['@id']
//   }
// }
// while (hasParent) {
//   const { data: parentInfo } = await useFetch('/api/dts/collections', {
//     body: { id: hasParent },
//     method: 'POST'
//   })
//   const parentTitle = {
//     de: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
//       ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')[
//           '@value'
//         ]
//       : parentInfo.value.title,
//     en: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
//       ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')[
//           '@value'
//         ]
//       : parentInfo.value.title
//   }
//   ancestors.value.unshift({ id: parentInfo.value['@id'], title: parentTitle })
//   if (parentInfo.value['dts:dublincore'] && parentInfo.value['dts:dublincore']['dct:isPartOf']) {
//     if (typeof parentInfo.value['dts:dublincore']['dct:isPartOf'] === 'string') {
//       hasParent = parentInfo.value['dts:dublincore']['dct:isPartOf']
//     } else if (Array.isArray(parentInfo.value['dts:dublincore']['dct:isPartOf'])) {
//       hasParent = parentInfo.value['dts:dublincore']['dct:isPartOf'][0]['@id']
//     } else {
//       hasParent = false
//     }
//   } else {
//     hasParent = false
//   }
// }
// const textPromises = allTexts.value.member.map(async (m) => {
//   const textData = await $fetch('/api/dts/collections', {
//     body: { id: m['@id'] },
//     method: 'POST'
//   })
//   const returnObject = {
//     id: textData['@id'],
//     de: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
//       ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
//       : m.title,
//     en: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
//       ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
//       : m.title,
//     type: textData['@type'],
//     versions: textData.member
//       ? textData.member.map((m) => [m['@id'], m['dts:extensions']['dc:language']])
//       : ''
//   }
//   if (returnObject.versions) {
//     const navData = await $fetch('/api/dts/navigation', {
//       body: { id: returnObject.versions[0][0] },
//       method: 'POST'
//     })
//     returnObject.firstChild = navData['hydra:member'][0].ref
//   }
//   return returnObject
// })
// const finishedPromises = await Promise.all(textPromises)

// const sortedMembers = computed(() => {
//   return [...finishedPromises].sort((a, b) => a.id.localeCompare(b.id))
// })
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
      <v-container v-else>
        <v-row justify="center">
          <v-col cols="12" xl="8" offset-xxl="2">
            <Breadcrumb v-if="ancestors.length > 0" :ancestors="ancestors" :index="0"></Breadcrumb>
          </v-col>
          <v-col cols="12" xl="8" xxl="6">
            <h1>{{ collName[locale] }}</h1>
            <CollectionList :sorted-members="collectionLists[route.params.collid]"></CollectionList>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-responsive>
</template>
