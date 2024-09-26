<script setup>
definePageMeta({
  middleware: ['auth']
})

const tab = ref(null)
const subTab = ref(null)
const { user } = useUserSession()
const { locale } = useI18n()
const programmaticChange = ref(false)
const collListState = useState('collList')
const collSearchListState = useState('collSearchList')
const subColls = [
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

const collectionLists = collListState.value
  ? collListState.value
  : ref({
      'urn:cts:cjhnt:nt': [],
      'urn:cts:cjhnt:lxx': [],
      'urn:cts:cjhnt:qumran': [],
      'urn:cts:greekLit:tlg0018': [],
      'urn:cts:greekLit:tlg0526': [],
      'urn:cts:cjhnt:pseudo': []
      // author_fragments: []
    })

const searchList = collSearchListState.value ? collSearchListState.value : ref([])

if (!collListState.value) {
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
      return finishedPromises.sort((a, b) => a.id.localeCompare(b.id))
    })
    data.value.map((e) => {
      searchList.value.push({
        id: e.id,
        en: e.en,
        de: e.de,
        subTab: e.parentId,
        tab: subColls.find((c) => {
          for (let subC of c.collections) {
            if (subC.urn === e.parentId) {
              return true
            }
          }
          return false
        }).title
      })
    })
    collectionLists.value[coll] = data.value
  }
  collListState.value = collectionLists.value
  collSearchListState.value = searchList.value
}
async function goToSubtab(newTab, newSubtab, newId) {
  if (tab.value !== newTab) {
    programmaticChange.value = true
  }
  subTab.value = newSubtab
  tab.value = newTab
  await nextTick()
  const foundElement = document.getElementById(newId)
  foundElement.addEventListener('animationend', () => foundElement.classList.remove('flash-yellow'))
  foundElement.classList.add('flash-yellow')
}

watch(tab, (newTab) => {
  if (!programmaticChange.value) {
    subTab.value = subColls.find((e) => e.title === newTab).collections[0].urn
  }
  programmaticChange.value = false
})
</script>

<template>
  <v-responsive>
    <Footer />
    <v-main class="d-flex" justify="center" style="min-height: 300px">
      <v-container v-if="user?.role === 'user'" class="text-column">
        <v-alert type="warning"
          >{{ $t('auth.onlyProject') }} <nuxt-link :to="{ name: 'index' }">Home</nuxt-link></v-alert
        >
      </v-container>
      <v-container v-else>
        <v-row justify="center">
          <v-col cols="12" xl="8" xxl="6">
            <v-autocomplete
              :items="searchList"
              :itemTitle="locale"
              noDataText="collection.emptySearchMessage"
              openText="collection.openMenu"
              closeText="collection.closeMenu"
              density="compact"
              :hint="$t('collection.searchHint')"
              width="200"
              persistent-hint
              clearable
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw[locale]"
                  @click="goToSubtab(item.raw.tab, item.raw.subTab, item.raw.id)"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
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

<style>
@keyframes work-focus {
  from {
    background-color: yellow;
  }
  to {
    background-color: initial;
  }
}

.flash-yellow {
  animation-name: work-focus;
  animation-duration: 5s;
}
</style>
