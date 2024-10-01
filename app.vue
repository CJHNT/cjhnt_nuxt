<script setup>
import './assets/main.css'
// const theme = ref('light')
// function toggleTheme() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
const nuxtApp = useNuxtApp()
const loading = ref(false)
nuxtApp.hook('page:start', () => {
  loading.value = true
})

nuxtApp.hook('page:finish', () => {
  loading.value = false
})
const collListState = useState('collList')
const collSearchListState = useState('collSearchList')
const primaryTextTabs = useState('primaryTextTabs')
primaryTextTabs.value = [
  {
    title: 'collection.bible',
    collections: [
      { title: 'collection.nt', urn: 'urn:cts:cjhnt:nt' },
      { title: 'collection.lxx', urn: 'urn:cts:cjhnt:lxx' }
    ]
  },
  {
    title: 'collection.authors',
    collections: [
      { title: 'collection.qumran', urn: 'urn:cts:cjhnt:qumran' },
      { title: 'collection.philo', urn: 'urn:cts:greekLit:tlg0018' },
      { title: 'collection.josephus', urn: 'urn:cts:greekLit:tlg0526' }
      // { title: 'collection.author_fragments', urn: 'author_fragments' }
    ]
  },
  {
    title: 'collection.pseudo',
    collections: [{ title: 'collection.pseudo', urn: 'urn:cts:cjhnt:pseudo' }]
  }
  // { title: 'collection.other', collections: [] }
]

const collectionLists = ref({
  'urn:cts:cjhnt:nt': [
    { id: 'nt_gospels', title: 'subcolls.gospels', subCollections: [] },
    { id: 'nt_letters', title: 'subcolls.epistles', subCollections: [] },
    { id: 'nt_revelation', title: 'subcolls.revelation', subCollections: [] }
  ],
  'urn:cts:cjhnt:lxx': [
    { id: 'lxx_pentateuch', title: 'subcolls.pentateuch', subCollections: [] },
    { id: 'lxx_history', title: 'subcolls.history', subCollections: [] },
    { id: 'lxx_poetic', title: 'subcolls.poetic', subCollections: [] },
    { id: 'lxx_prophetic', title: 'subcolls.prophetic', subCollections: [] }
  ],
  'urn:cts:cjhnt:qumran': [{ id: 'urn:cts:cjhnt:qumran', title: '', subCollections: [] }],
  'urn:cts:greekLit:tlg0018': [
    { id: 'philo_legal', title: 'subcolls.philo_legal', subCollections: [] },
    { id: 'philo_allegorical', title: 'subcolls.philo_allegorical', subCollections: [] },
    // { id: 'philo_questions', title: 'subcolls.philo_questions', subCollections: [] },
    { id: 'philo_historical', title: 'subcolls.philo_historical', subCollections: [] },
    { id: 'philo_philosophy', title: 'subcolls.philo_philosophy', subCollections: [] }
  ],
  'urn:cts:greekLit:tlg0526': [{ id: 'urn:cts:greekLit:tlg0526', title: '', subCollections: [] }],
  'urn:cts:cjhnt:pseudo': [{ id: 'urn:cts:cjhnt:pseudo', title: '', subCollections: [] }]
  // author_fragments: []
})

const searchList = ref([])

await callOnce(async () => {
  for (const [coll, subCollInfo] of Object.entries(collectionLists.value)) {
    for (const subColl of subCollInfo) {
      const { data: subCollTexts } = await useAsyncData(`${subColl.id}Data`, async () => {
        const subCollTextsInfo = await $fetch('/api/dts/collections', {
          body: { id: subColl.id },
          method: 'POST'
        })
        const textPromises = subCollTextsInfo.member.map(async (m) => {
          const textData = await $fetch('/api/dts/collections', {
            body: { id: m['@id'] },
            method: 'POST'
          })
          const returnObject = {
            id: textData['@id'],
            de: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
              ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')[
                  '@value'
                ]
              : m.title,
            en: textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
              ? textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')[
                  '@value'
                ]
              : m.title,
            type: textData['@type'],
            versions: textData.member.map((m) => [m['@id'], m['dts:extensions']['dc:language']]),
            parentId: coll
          }
          const navData = await $fetch('/api/dts/navigation', {
            body: { id: returnObject.versions[0][0] },
            method: 'POST'
          })
          returnObject.firstChild = navData['hydra:member'][0].ref
          return returnObject
        })
        const finishedPromises = await Promise.all(textPromises)
        subColl.subCollections = finishedPromises.sort((a, b) => a.id.localeCompare(b.id))

        subColl.subCollections.map((e) => {
          searchList.value.push({
            id: e.id,
            en: e.en,
            de: e.de,
            subTab: e.parentId,
            tab: primaryTextTabs.value.find((c) => {
              for (let subC of c.collections) {
                if (subC.urn === e.parentId) {
                  return true
                }
              }
              return false
            }).title
          })
        })
      })
    }
  }
  collListState.value = collectionLists.value
  collSearchListState.value = searchList.value
})
</script>

<template>
  <NuxtLayout>
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
    </v-overlay>
    <NuxtPage />
  </NuxtLayout>
</template>
