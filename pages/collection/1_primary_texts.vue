<script setup>
definePageMeta({
  middleware: ['auth']
})

const tab = ref(null)
const subTab = ref(null)
const loading = ref(false)
const { user } = useUserSession()
const { locale } = useI18n()
const { name } = useDisplay()
const subColls = [
  {
    title: 'collection.bible',
    collections: [
      { title: 'collection.nt', urn: 'urn:cts:greekLit:tlg0031' },
      { title: 'collection.lxx', urn: 'urn:cts:greekLit:lxx' }
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
  'urn:cts:greekLit:tlg0031': [],
  'urn:cts:greekLit:lxx': [],
  'urn:cts:cjhnt:qumran': [],
  'urn:cts:greekLit:tlg0018': [],
  'urn:cts:greekLit:tlg0526': [],
  'urn:cts:cjhnt:pseudo': []
  // author_fragments: []
})

for (let coll in collectionLists.value) {
  const { data } = await useAsyncData(`${coll}Texts`, async () => {
    const allTexts = await $fetch('/api/dts/collections', {
      body: { id: coll },
      method: 'POST'
    })
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
        type: textData['@type'],
        versions: textData.member.map((m) => [m['@id'], m['dts:extensions']['dc:language']])
      }
      return returnObject
    })
    const finishedPromises = await Promise.all(textPromises)
    return finishedPromises.sort((a, b) => a.id.localeCompare(b.id))
  })
  collectionLists.value[coll] = data.value
}

// watch(subTab, (newUrn) => {
//   sortedMembers.value = [...collectionLists.value[newUrn]].sort((a, b) => a.id.localeCompare(b.id))
// })
watch(tab, (newTab) => {
  subTab.value = subColls.find((e) => e.title === newTab).collections[0].urn
})
</script>

<template>
  <v-responsive>
    <Footer />
    <v-container v-if="user?.role === 'user'">
      <v-alert type="warning"
        >This page is only available to project members.
        <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
      >
    </v-container>
    <v-main v-else class="d-flex" justify="center" style="min-height: 300px">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" xl="8" xxl="6">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab v-for="subColl in subColls" :key="subColl.title" :value="subColl.title">{{
                  $t(subColl.title)
                }}</v-tab>
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item
                    v-for="subColl in subColls"
                    :key="subColl.title"
                    :value="subColl.title"
                    class="overflow-auto"
                  >
                    <v-card v-if="subColl.collections.length > 1">
                      <v-tabs v-model="subTab">
                        <v-tab
                          v-for="coll in subColl.collections"
                          :key="coll.urn"
                          :value="coll.urn"
                          >{{ $t(coll.title) }}</v-tab
                        >
                      </v-tabs>
                      <v-card-text>
                        <v-tabs-window v-model="subTab">
                          <v-tabs-window-item
                            v-for="coll in subColl.collections"
                            :key="coll.urn"
                            :value="coll.urn"
                          >
                            <CollectionList :sortedMembers="collectionLists[coll.urn]" />
                          </v-tabs-window-item>
                        </v-tabs-window>
                      </v-card-text>
                    </v-card>

                    <CollectionList
                      v-else
                      :sortedMembers="collectionLists[subColl.collections[0].urn]"
                    />
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-responsive>
</template>
