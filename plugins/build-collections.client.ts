interface SubCollectionList {
  id: string
  de: string
  en: string
  type: string
  versions: [string, string, string, string, string, number][]
  parentId: string
  firstChild: string
}

const collSearchListState = [] as {
  id: string
  en: string
  de: string
  subTab: string
  tab: string
  openText: 'open' | 'closed'
}[]
const primaryTextTabs = [
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
      // { title: 'collection.author_fragments', urn: 'urn:cts:cjhnt:author_fragments' }
    ]
  },
  {
    title: 'collection.pseudo',
    collections: [{ title: 'collection.pseudo', urn: 'urn:cts:cjhnt:pseudo' }]
  },
  {
    title: 'collection.other',
    collections: [{ title: 'collection.epigraphic', urn: 'urn:cts:cjhnt:epigraphic' }]
  }
]

const collListState = {
  'urn:cts:cjhnt:nt': [
    { id: 'nt_gospels', title: 'subcolls.gospels', subCollections: [] as SubCollectionList[] },
    { id: 'nt_letters', title: 'subcolls.epistles', subCollections: [] as SubCollectionList[] },
    {
      id: 'nt_revelation',
      title: 'subcolls.revelation',
      subCollections: [] as SubCollectionList[]
    }
  ],
  'urn:cts:cjhnt:lxx': [
    {
      id: 'lxx_pentateuch',
      title: 'subcolls.pentateuch',
      subCollections: [] as SubCollectionList[]
    },
    { id: 'lxx_history', title: 'subcolls.history', subCollections: [] as SubCollectionList[] },
    { id: 'lxx_poetic', title: 'subcolls.poetic', subCollections: [] as SubCollectionList[] },
    {
      id: 'lxx_prophetic',
      title: 'subcolls.prophetic',
      subCollections: [] as SubCollectionList[]
    }
  ],
  'urn:cts:cjhnt:qumran': [
    { id: 'urn:cts:cjhnt:qumran', title: '', subCollections: [] as SubCollectionList[] }
  ],
  'urn:cts:greekLit:tlg0018': [
    {
      id: 'philo_legal',
      title: 'subcolls.philo_legal',
      subCollections: [] as SubCollectionList[]
    },
    {
      id: 'philo_allegorical',
      title: 'subcolls.philo_allegorical',
      subCollections: [] as SubCollectionList[]
    },
    // { id: 'philo_questions', title: 'subcolls.philo_questions', subCollections: [] as SubCollectionList[] },
    {
      id: 'philo_historical',
      title: 'subcolls.philo_historical',
      subCollections: [] as SubCollectionList[]
    },
    {
      id: 'philo_philosophy',
      title: 'subcolls.philo_philosophy',
      subCollections: [] as SubCollectionList[]
    }
  ],
  'urn:cts:greekLit:tlg0526': [
    { id: 'urn:cts:greekLit:tlg0526', title: '', subCollections: [] as SubCollectionList[] }
  ],
  'urn:cts:cjhnt:pseudo': [
    { id: 'urn:cts:cjhnt:pseudo', title: '', subCollections: [] as SubCollectionList[] }
  ],
  // author_fragments: [],
  'urn:cts:cjhnt:epigraphic': [
    { id: 'urn:cts:cjhnt:epigraphic', title: '', subCollections: [] as SubCollectionList[] }
  ]
}

const allWorks = [] as SubCollectionList[]

export default defineNuxtPlugin({
  name: 'build-collections',
  parallel: true,
  setup() {
    onNuxtReady(async () => {
      for (const [coll, subCollInfo] of Object.entries(collListState)) {
        for (const subColl of subCollInfo) {
          const subCollTextsInfo = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
            body: { id: subColl.id },
            method: 'POST'
          })
          if (subCollTextsInfo) {
            const textPromises = subCollTextsInfo.member.map(async (m) => {
              const textData = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
                body: { id: m['@id'] },
                method: 'POST'
              })
              const returnObject: SubCollectionList = {
                id: textData['@id'],
                de:
                  textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.[
                    '@value'
                  ] || m.title,
                en:
                  textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.[
                    '@value'
                  ] || m.title,
                type: textData['@type'],
                versions: textData.member.map((m) => [
                  m['@id'],
                  m['dts:extensions']['dc:language'],
                  m['dts:dublincore'] && m['dts:dublincore']['dct:accessRights']
                    ? m['dts:dublincore']['dct:accessRights']
                    : 'closed',
                  m['dts:extensions']['dc:language'] === 'eng'
                    ? m['dts:dublincore']?.['dct:bibliographicCitation'].find(
                        (e) => e['@language'] === 'eng'
                      )?.['@value'] || ''
                    : m['dts:extensions']['dc:language'] === 'deu'
                      ? m['dts:dublincore']?.['dct:bibliographicCitation'].find(
                          (e) => e['@language'] === 'deu'
                        )?.['@value'] || ''
                      : m['dts:dublincore']?.['dct:bibliographicCitation']?.[0]['@value'] || '',
                  m['dts:extensions']['dc:type'],
                  m['dts:citeDepth']
                ]),
                parentId: coll,
                firstChild: ''
              }
              const navData = await $fetch<DtsNavigation>('/api/dts/navigation', {
                body: { id: returnObject.versions[0][0] },
                method: 'POST'
              })
              returnObject.firstChild = navData['hydra:member'][0].ref
              return returnObject
            })
            const finishedPromises = await Promise.all(textPromises)
            subColl.subCollections = finishedPromises.sort((a, b) => a.id.localeCompare(b.id))

            subColl.subCollections.map((e) => {
              collSearchListState.push({
                id: e.id,
                en: e.en,
                de: e.de,
                subTab: e.parentId,
                tab:
                  primaryTextTabs.find((c) => {
                    for (const subC of c.collections) {
                      if (subC.urn === e.parentId) {
                        return true
                      }
                    }
                    return false
                  })?.title || '',
                openText: 'open'
              })
              allWorks.push(e)
            })
            collSearchListState.sort((a, b) => a.id.localeCompare(b.id))
          }
        }
      }
      useState('collList', () => collListState)
      useState('collSearchList', () => collSearchListState)
      useState('primaryTextTabs', () => primaryTextTabs)
      useState('allWorks', () => allWorks)
    })
  }
})

export type { SubCollectionList }
