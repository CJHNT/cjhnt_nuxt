// import { defineNuxtModule } from 'nuxt/kit'

// export default defineNuxtModule({
//   meta: {
//     name: 'build-corpora'
//   },
//   async setup() {
//     const ntBookList = [
//       'urn:cts:cjhnt:commentary.mt',
//       'urn:cts:cjhnt:commentary.mk',
//       'urn:cts:cjhnt:commentary.lk',
//       'urn:cts:cjhnt:commentary.joh',
//       'urn:cts:cjhnt:commentary.act',
//       'urn:cts:cjhnt:commentary.röm',
//       'urn:cts:cjhnt:commentary.1kor',
//       'urn:cts:cjhnt:commentary.2kor',
//       'urn:cts:cjhnt:commentary.gal',
//       'urn:cts:cjhnt:commentary.eph',
//       'urn:cts:cjhnt:commentary.phil',
//       'urn:cts:cjhnt:commentary.kol',
//       'urn:cts:cjhnt:commentary.1thess',
//       'urn:cts:cjhnt:commentary.2thess',
//       'urn:cts:cjhnt:commentary.1tim',
//       'urn:cts:cjhnt:commentary.2tim',
//       'urn:cts:cjhnt:commentary.tit',
//       'urn:cts:cjhnt:commentary.phlm',
//       'urn:cts:cjhnt:commentary.hebr',
//       'urn:cts:cjhnt:commentary.jak',
//       'urn:cts:cjhnt:commentary.1petr',
//       'urn:cts:cjhnt:commentary.2petr',
//       'urn:cts:cjhnt:commentary.1joh',
//       'urn:cts:cjhnt:commentary.2joh',
//       'urn:cts:cjhnt:commentary.3joh',
//       'urn:cts:cjhnt:commentary.jud',
//       'urn:cts:cjhnt:commentary.apk'
//     ]
//     interface SubCollectionList {
//       id: string
//       de: string
//       en: string
//       type: string
//       versions: string[][]
//       parentId: string
//       firstChild: string
//     }
//     interface CommentarySubcollection extends SubCollectionList {
//       parentTitle: { de: string; en: string }
//       openText: 'open' | 'closed'
//     }
//     interface CommentaryChapter {
//       id: string
//       title: string
//       chapter: number
//       parentTitle: { de: string; en: string }
//       subCollections: CommentarySubcollection[]
//     }
//     const wissensSpeicher = {
//       wissen_texts: [] as { id: string; title: string; subCollections: SubCollectionList[] }[]
//     }
//     const commentaryListState = {} as { [key: string]: CommentaryChapter[] }
//     const commentarySearchListState = [] as {
//       id: string
//       en: string
//       de: string
//       tab: string
//       openText: 'open' | 'closed'
//     }[]
//     const collSearchListState = [] as {
//       id: string
//       en: string
//       de: string
//       subTab: string
//       tab: string
//       openText: 'open' | 'closed'
//     }[]
//     const primaryTextTabs = [
//       {
//         title: 'collection.bible',
//         collections: [
//           { title: 'collection.nt', urn: 'urn:cts:cjhnt:nt' },
//           { title: 'collection.lxx', urn: 'urn:cts:cjhnt:lxx' }
//         ]
//       },
//       {
//         title: 'collection.authors',
//         collections: [
//           { title: 'collection.qumran', urn: 'urn:cts:cjhnt:qumran' },
//           { title: 'collection.philo', urn: 'urn:cts:greekLit:tlg0018' },
//           { title: 'collection.josephus', urn: 'urn:cts:greekLit:tlg0526' }
//           // { title: 'collection.author_fragments', urn: 'author_fragments' }
//         ]
//       },
//       {
//         title: 'collection.pseudo',
//         collections: [{ title: 'collection.pseudo', urn: 'urn:cts:cjhnt:pseudo' }]
//       }
//       // { title: 'collection.other', collections: [] }
//     ]

//     const collListState = {
//       'urn:cts:cjhnt:nt': [
//         { id: 'nt_gospels', title: 'subcolls.gospels', subCollections: [] as SubCollectionList[] },
//         { id: 'nt_letters', title: 'subcolls.epistles', subCollections: [] as SubCollectionList[] },
//         {
//           id: 'nt_revelation',
//           title: 'subcolls.revelation',
//           subCollections: [] as SubCollectionList[]
//         }
//       ],
//       'urn:cts:cjhnt:lxx': [
//         {
//           id: 'lxx_pentateuch',
//           title: 'subcolls.pentateuch',
//           subCollections: [] as SubCollectionList[]
//         },
//         { id: 'lxx_history', title: 'subcolls.history', subCollections: [] as SubCollectionList[] },
//         { id: 'lxx_poetic', title: 'subcolls.poetic', subCollections: [] as SubCollectionList[] },
//         {
//           id: 'lxx_prophetic',
//           title: 'subcolls.prophetic',
//           subCollections: [] as SubCollectionList[]
//         }
//       ],
//       'urn:cts:cjhnt:qumran': [
//         { id: 'urn:cts:cjhnt:qumran', title: '', subCollections: [] as SubCollectionList[] }
//       ],
//       'urn:cts:greekLit:tlg0018': [
//         {
//           id: 'philo_legal',
//           title: 'subcolls.philo_legal',
//           subCollections: [] as SubCollectionList[]
//         },
//         {
//           id: 'philo_allegorical',
//           title: 'subcolls.philo_allegorical',
//           subCollections: [] as SubCollectionList[]
//         },
//         // { id: 'philo_questions', title: 'subcolls.philo_questions', subCollections: [] as SubCollectionList[] },
//         {
//           id: 'philo_historical',
//           title: 'subcolls.philo_historical',
//           subCollections: [] as SubCollectionList[]
//         },
//         {
//           id: 'philo_philosophy',
//           title: 'subcolls.philo_philosophy',
//           subCollections: [] as SubCollectionList[]
//         }
//       ],
//       'urn:cts:greekLit:tlg0526': [
//         { id: 'urn:cts:greekLit:tlg0526', title: '', subCollections: [] as SubCollectionList[] }
//       ],
//       'urn:cts:cjhnt:pseudo': [
//         { id: 'urn:cts:cjhnt:pseudo', title: '', subCollections: [] as SubCollectionList[] }
//       ]
//       // author_fragments: []
//     }

//     for (const [coll, subCollInfo] of Object.entries(collListState)) {
//       for (const subColl of subCollInfo) {
//         const { data: subCollTextsInfo } = await useAsyncData<DtsNonReadableCollection>(
//           `${subColl.id}Data`,
//           async () =>
//             await $fetch('/api/dts/collections', {
//               body: { id: subColl.id },
//               method: 'POST'
//             })
//         )
//         if (subCollTextsInfo.value) {
//           const textPromises = subCollTextsInfo.value.member.map(async (m) => {
//             const textData = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
//               body: { id: m['@id'] },
//               method: 'POST'
//             })
//             const returnObject: SubCollectionList = {
//               id: textData['@id'],
//               de:
//                 textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.[
//                   '@value'
//                 ] || m.title,
//               en:
//                 textData['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.[
//                   '@value'
//                 ] || m.title,
//               type: textData['@type'],
//               versions: textData.member.map((m) => [
//                 m['@id'],
//                 m['dts:extensions']['dc:language'],
//                 m['dts:dublincore'] && m['dts:dublincore']['dct:accessRights']
//                   ? m['dts:dublincore']['dct:accessRights']
//                   : 'closed'
//               ]),
//               parentId: coll,
//               firstChild: ''
//             }
//             const navData = await $fetch<DtsNavigation>('/api/dts/navigation', {
//               body: { id: returnObject.versions[0][0] },
//               method: 'POST'
//             })
//             returnObject.firstChild = navData['hydra:member'][0].ref
//             return returnObject
//           })
//           const finishedPromises = await Promise.all(textPromises)
//           subColl.subCollections = finishedPromises.sort((a, b) => a.id.localeCompare(b.id))

//           subColl.subCollections.map((e) => {
//             collSearchListState.push({
//               id: e.id,
//               en: e.en,
//               de: e.de,
//               subTab: e.parentId,
//               tab:
//                 primaryTextTabs.find((c) => {
//                   for (const subC of c.collections) {
//                     if (subC.urn === e.parentId) {
//                       return true
//                     }
//                   }
//                   return false
//                 })?.title || '',
//               openText: 'open'
//             })
//           })
//           collSearchListState.sort((a, b) => a.id.localeCompare(b.id))
//         }
//       }
//     }

//     const { data: commentaryCollections } = await useAsyncData<DtsNonReadableCollection>(
//       'commentaryCollections',
//       () =>
//         $fetch('/api/dts/collections', {
//           body: { id: 'urn:cts:cjhnt:commentary' },
//           method: 'POST'
//         })
//     )
//     if (commentaryCollections.value) {
//       for (const coll of commentaryCollections.value.member) {
//         const { data: allTexts } = await useAsyncData<DtsNonReadableCollection>(
//           `${coll['@id']}Texts`,
//           async () =>
//             await $fetch('/api/dts/collections', {
//               body: { id: coll['@id'] },
//               method: 'POST'
//             })
//         )
//         if (allTexts.value) {
//           const parentTitle = {
//             de:
//               allTexts.value['dts:dublincore']?.['dct:alternative']?.find(
//                 (t) => t['@language'] === 'deu'
//               )?.['@value'] || allTexts.value.title,
//             en:
//               allTexts.value['dts:dublincore']?.['dct:alternative']?.find(
//                 (t) => t['@language'] === 'eng'
//               )?.['@value'] || allTexts.value.title
//           }
//           const textInfo = allTexts.value.member.map((m) => {
//             const returnObject: CommentarySubcollection = {
//               id: m['@id'],
//               de:
//                 m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.['@value'] ||
//                 m.title,
//               en:
//                 m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.['@value'] ||
//                 m.title,
//               type: m['@type'],
//               parentId: coll['@id'],
//               parentTitle: parentTitle,
//               firstChild: '1',
//               versions: [['']],
//               openText:
//                 m['dts:dublincore'] && m['dts:dublincore']['dct:accessRights']
//                   ? m['dts:dublincore']['dct:accessRights']
//                   : 'closed'
//             }
//             return returnObject
//           })
//           const asycReturn = textInfo.sort((a, b) => a.id.localeCompare(b.id))
//           const chapters: CommentaryChapter[] = []
//           for (const c of asycReturn) {
//             const chapter = parseInt(c.id.split('.').at(-1)?.split('_')[0] || '1')
//             const cExists = chapters.find((d) => d.chapter === chapter)
//             if (cExists) {
//               cExists.subCollections.push(c)
//             } else {
//               chapters.push({
//                 id: coll['@id'],
//                 title: 'chapter',
//                 chapter: chapter,
//                 parentTitle: parentTitle,
//                 subCollections: [c]
//               })
//             }
//           }
//           commentaryListState[coll['@id']] = chapters
//           asycReturn.map((e) => {
//             commentarySearchListState.push({
//               id: e.id,
//               en: `${e.parentTitle.en} ${e.en}`,
//               de: `${e.parentTitle.de} ${e.de}`,
//               tab: e.parentId,
//               openText: e.openText
//             })
//           })
//         }
//         commentarySearchListState.sort(
//           (a, b) => ntBookList.indexOf(a.tab) - ntBookList.indexOf(b.tab)
//         )
//       }
//     }

//     const { data: wissenTexts } = await useAsyncData<DtsNonReadableCollection>('wissenTexts', () =>
//       $fetch('/api/dts/collections', {
//         body: { id: 'wissen_texts' },
//         method: 'POST'
//       })
//     )
//     if (wissenTexts.value) {
//       wissensSpeicher.wissen_texts = [
//         {
//           id: 'wissen_texts',
//           title: '',
//           subCollections: wissenTexts.value.member.map((text) => {
//             const wissenObject = {
//               id: text['@id'],
//               de:
//                 text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')?.[
//                   '@value'
//                 ] || text.title,
//               en:
//                 text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')?.[
//                   '@value'
//                 ] || text.title,
//               type: text['@type'],
//               versions: [['']],
//               parentId: 'wissen_texts',
//               firstChild: '1'
//             }
//             return wissenObject
//           })
//         }
//       ]
//     }
//     return {
//       primaryTexts: collListState,
//       primaryTextSearch: collSearchListState,
//       commentaryTexts: commentaryListState,
//       commentaryTextSearch: commentarySearchListState,
//       wissenTexts: wissensSpeicher
//     }
//   }
// })
