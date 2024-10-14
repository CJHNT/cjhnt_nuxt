<script setup>
import './assets/main.css'
// const theme = ref('light')
// function toggleTheme() {
//   theme.value = theme.value === 'light' ? 'dark' : 'light'
// }
const nuxtApp = useNuxtApp()
const { user } = useUserSession()
const loading = ref(false)
nuxtApp.hook('page:start', () => {
  loading.value = true
})

nuxtApp.hook('page:finish', () => {
  loading.value = false
})
if (user.value && user.value.role !== 'user') {
  const collListState = useState('collList')
  const collSearchListState = useState('collSearchList')
  const primaryTextTabs = useState('primaryTextTabs')
  const wissensSpeicher = useState('wissensSpeicher')
  const commentaryListState = useState('commentaryList')
  const commentarySearchListState = useState('commentarySearchList')
  const ntBookList = useState('ntBookList')
  ntBookList.value = [
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
  commentaryListState.value = {}
  commentarySearchListState.value = []
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

  collListState.value = {
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
  }

  collSearchListState.value = []

  for (const [coll, subCollInfo] of Object.entries(collListState.value)) {
    for (const subColl of subCollInfo) {
      const { data: subCollTextsInfo } = await useAsyncData(
        `${subColl.id}Data`,
        async () =>
          await $fetch('/api/dts/collections', {
            body: { id: subColl.id },
            method: 'POST'
          })
      )
      const textPromises = subCollTextsInfo.value.member.map(async (m) => {
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
      subColl.subCollections = finishedPromises.sort((a, b) => a.id.localeCompare(b.id))

      subColl.subCollections.map((e) => {
        collSearchListState.value.push({
          id: e.id,
          en: e.en,
          de: e.de,
          subTab: e.parentId,
          tab: primaryTextTabs.value.find((c) => {
            for (const subC of c.collections) {
              if (subC.urn === e.parentId) {
                return true
              }
            }
            return false
          }).title
        })
      })
      collSearchListState.value.sort((a, b) => a.id.localeCompare(b.id))
    }
  }

  const { data: commentaryCollections } = await useAsyncData('commentaryCollections', () =>
    $fetch('/api/dts/collections', {
      body: { id: 'urn:cts:cjhnt:commentary' },
      method: 'POST'
    })
  )
  for (const coll of commentaryCollections.value.member) {
    const { data: allTexts } = await useAsyncData(
      `${coll['@id']}Texts`,
      async () =>
        await $fetch('/api/dts/collections', {
          body: { id: coll['@id'] },
          method: 'POST'
        })
    )
    const bibNamespace = Object.keys(allTexts.value['@context']).find(
      (ns) => allTexts.value['@context'][ns] === 'http://bibliotek-o.org/1.0/ontology/'
    )
    const parentTitle = {
      de: allTexts.value['dts:extensions'][`${bibNamespace}:AbbreviatedTitle`].find(
        (t) => t['@language'] === 'deu'
      )
        ? allTexts.value['dts:extensions'][`${bibNamespace}:AbbreviatedTitle`].find(
            (t) => t['@language'] === 'deu'
          )['@value']
        : allTexts.value.title,
      en: allTexts.value['dts:extensions'][`${bibNamespace}:AbbreviatedTitle`].find(
        (t) => t['@language'] === 'eng'
      )
        ? allTexts.value['dts:extensions'][`${bibNamespace}:AbbreviatedTitle`].find(
            (t) => t['@language'] === 'eng'
          )['@value']
        : allTexts.value.title
    }
    const textInfo = allTexts.value.member.map((m) => {
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
        parentTitle: parentTitle,
        firstChild: '1',
        versions: null
      }
      return returnObject
    })
    const asycReturn = textInfo.sort((a, b) => a.id.localeCompare(b.id))
    const chapters = []
    for (const c of asycReturn) {
      const chapter = parseInt(c.id.split('.').at(-1).split('_')[0])
      const cExists = chapters.find((d) => d.chapter === chapter)
      if (cExists) {
        cExists.subCollections.push(c)
      } else {
        chapters.push({
          id: coll['@id'],
          title: 'chapter',
          chapter: chapter,
          parentTitle: parentTitle,
          subCollections: [c]
        })
      }
    }
    commentaryListState.value[coll['@id']] = chapters
    asycReturn.map((e) => {
      commentarySearchListState.value.push({
        id: e.id,
        en: `${e.parentTitle.en} ${e.en}`,
        de: `${e.parentTitle.de} ${e.de}`,
        tab: e.parentId
      })
    })
  }
  commentarySearchListState.value = commentarySearchListState.value.sort(
    (a, b) => ntBookList.value.indexOf(a.tab) - ntBookList.value.indexOf(b.tab)
  )

  const { data: wissenTexts } = await useAsyncData('wissenTexts', () =>
    $fetch('/api/dts/collections', {
      body: { id: 'wissen_texts' },
      method: 'POST'
    })
  )
  wissensSpeicher.value = {
    wissen_texts: [
      {
        id: 'wissen_texts',
        title: '',
        subCollections: wissenTexts.value.member.map((text) => {
          const wissenObject = {
            id: text['@id'],
            de: text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')
              ? text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')['@value']
              : text.title,
            en: text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')
              ? text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')['@value']
              : text.title,
            type: text['@type'],
            versions: null,
            parentId: 'wissen_texts',
            firstChild: '1'
          }
          return wissenObject
        })
      }
    ]
  }
}
</script>

<template>
  <NuxtLayout>
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
    </v-overlay>
    <NuxtPage />
  </NuxtLayout>
</template>
