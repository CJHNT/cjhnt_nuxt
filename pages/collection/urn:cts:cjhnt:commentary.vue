<script setup>
definePageMeta({
  middleware: ['auth']
})
const ntBookList = [
  'urn:cts:cjhnt:commentary.mt',
  'urn:cts:cjhnt:commentary.mk',
  'urn:cts:cjhnt:commentary.lk',
  'urn:cts:cjhnt:commentary.joh',
  'urn:cts:cjhnt:commentary.act',
  'urn:cts:cjhnt:commentary.röm',
  'urn:cts:cjhnt:commentary.1kor',
  'urn:cts:cjhnt:commentary.2kor',
  'urn:cts:cjhnt:commentary.gal',
  'urn:cts:cjhnt:commentary.eph',
  'urn:cts:cjhnt:commentary.phil',
  'urn:cts:cjhnt:commentary.kol',
  'urn:cts:cjhnt:commentary.1thess',
  'urn:cts:cjhnt:commentary.2thess',
  'urn:cts:cjhnt:commentary.1tim',
  'urn:cts:cjhnt:commentary.2tim',
  'urn:cts:cjhnt:commentary.tit',
  'urn:cts:cjhnt:commentary.phlm',
  'urn:cts:cjhnt:commentary.hebr',
  'urn:cts:cjhnt:commentary.jak',
  'urn:cts:cjhnt:commentary.1petr',
  'urn:cts:cjhnt:commentary.2petr',
  'urn:cts:cjhnt:commentary.1joh',
  'urn:cts:cjhnt:commentary.2joh',
  'urn:cts:cjhnt:commentary.3joh',
  'urn:cts:cjhnt:commentary.jud',
  'urn:cts:cjhnt:commentary.apk'
]

const tab = ref(null)
const { user } = useUserSession()
const { locale } = useI18n()
const commentaryListState = useState('commentaryList')
const commentarySearchListState = useState('commentarySearchList')

const commentaryLists = commentaryListState.value ? ref(commentaryListState.value) : ref([])

const searchList = commentarySearchListState.value ? ref(commentarySearchListState.value) : ref([])

if (!commentaryListState.value) {
  const { data: commentaryCollections } = await useFetch('/api/dts/collections', {
    body: { id: 'urn:cts:cjhnt:commentary' },
    method: 'POST'
  })
  for (let coll of commentaryCollections.value.member) {
    const { data } = await useAsyncData(`${coll['@id']}Texts`, async () => {
      const allTexts = await $fetch('/api/dts/collections', {
        body: { id: coll['@id'] },
        method: 'POST'
      })
      const parentTitle = {
        de: allTexts['dts:extensions']['ns2:AbbreviatedTitle'].find((t) => t['@language'] === 'deu')
          ? allTexts['dts:extensions']['ns2:AbbreviatedTitle'].find(
              (t) => t['@language'] === 'deu'
            )['@value']
          : allTexts.title,
        en: allTexts['dts:extensions']['ns2:AbbreviatedTitle'].find((t) => t['@language'] === 'eng')
          ? allTexts['dts:extensions']['ns2:AbbreviatedTitle'].find(
              (t) => t['@language'] === 'eng'
            )['@value']
          : allTexts.title
      }
      console.log('intermediate data', allTexts)
      const textInfo = allTexts.member.map((m) => {
        const returnObject = {
          id: m['@id'],
          de: m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')
            ? m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')['@value']
            : m.title,
          en: m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')
            ? m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')['@value']
            : m.title,
          type: m['@type'],
          parentId: coll['@id'],
          parentTitle: parentTitle
        }
        return returnObject
      })
      const asycReturn = textInfo.sort((a, b) => a.id.localeCompare(b.id))
      commentaryLists.value.push({ id: coll['@id'], title: parentTitle, commentaries: asycReturn })
      return asycReturn
    })
    console.log('returnData', data.value)
    data.value.map((e) => {
      searchList.value.push({
        id: e.id,
        en: `${e.parentTitle.en} ${e.en}`,
        de: `${e.parentTitle.de} ${e.de}`,
        tab: e.parentId
      })
    })
  }
  commentaryLists.value = commentaryLists.value.sort(
    (a, b) => ntBookList.indexOf(a.id) - ntBookList.indexOf(b.id)
  )
  searchList.value = searchList.value.sort(
    (a, b) => ntBookList.indexOf(a.tab) - ntBookList.indexOf(b.tab)
  )
  commentaryListState.value = commentaryLists.value
  commentarySearchListState.value = searchList.value
}
async function goToSubtab(newTab, newId) {
  tab.value = newTab
  await nextTick()
  const foundElement = document.getElementById(newId)
  foundElement.addEventListener('animationend', () => foundElement.classList.remove('flash-yellow'))
  foundElement.classList.add('flash-yellow')
}
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
              openText="collection.commentaryOpenMenu"
              closeText="collection.commentaryCloseMenu"
              density="compact"
              :hint="$t('collection.commentarySearchHint')"
              width="200"
              persistent-hint
              clearable
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.raw[locale]"
                  @click="goToSubtab(item.raw.tab, item.raw.id)"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" xl="8" xxl="6">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab
                  v-for="commentary in commentaryLists"
                  :key="commentary.id"
                  :value="commentary.id"
                  >{{ commentary.title[locale] }}</v-tab
                >
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item
                    v-for="commentary in commentaryLists"
                    :key="commentary.id"
                    :value="commentary.id"
                    class="overflow-auto"
                  >
                    <CollectionList :sortedMembers="commentary.commentaries" />
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
