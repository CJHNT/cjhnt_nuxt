<script setup>
definePageMeta({
  middleware: ['project-auth']
})
const authorized = useState('authorized')
const route = useRoute()

const { locale } = useI18n()
const collName = ref({})
const ancestors = ref([])
const collectionLists = route.params.collid.includes('commentary')
  ? useState('commentaryList')
  : route.params.collid.includes('wissen_texts')
    ? useState('wissensSpeicher')
    : useState('collList')

const parentUrn = route.params.collid.includes('commentary')
  ? 'urn:cts:cjhnt:commentary'
  : '1_primary_texts'

if (!route.params.collid.includes('wissen_texts')) {
  const { data: parentInfo } = await useFetch('/api/dts/collections', {
    body: { id: parentUrn },
    method: 'POST'
  })
  const parentTitle = {
    de: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
      ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')[
          '@value'
        ]
      : parentInfo.value.title,
    en: parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
      ? parentInfo.value['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')[
          '@value'
        ]
      : parentInfo.value.title
  }
  ancestors.value.push({ id: parentUrn, title: parentTitle })
}

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
</script>

<template>
  <v-responsive class="align-center">
    <AppFooter />
    <v-main class="d-flex justify-center" style="min-height: 300px">
      <NotificationContainer />
      <template v-if="!collectionLists">
        <v-container>
          <v-row justify="center" align="center">
            <v-col cols="auto" align-self="center">
              <v-progress-circular color="primary" size="64" indeterminate />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-else>
        <v-container v-if="authorized">
          <v-row justify="center">
            <v-col cols="12" xl="8" offset-xxl="2">
              <BreadCrumb v-if="ancestors.length > 0" :ancestors="ancestors" :index="0" />
            </v-col>
            <v-col cols="12" xl="8" xxl="6">
              <h1>{{ collName[locale] }}</h1>
              <CollectionList :sorted-members="collectionLists[route.params.collid]" />
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-main>
  </v-responsive>
</template>
