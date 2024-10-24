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
interface SubCollectionList {
  id: string
  de: string
  en: string
  type: string
  versions: string[][]
  parentId: string
  firstChild: string
}
interface CommentarySubcollection extends SubCollectionList {
  parentTitle: { de: string; en: string }
  openText: 'open' | 'closed'
}
interface CommentaryChapter {
  id: string
  title: string
  chapter: number
  parentTitle: { de: string; en: string }
  subCollections: CommentarySubcollection[]
}
const commentaryListState = {} as { [key: string]: CommentaryChapter[] }
const commentarySearchListState = [] as {
  id: string
  en: string
  de: string
  tab: string
  openText: 'open' | 'closed'
}[]

export default defineNuxtPlugin({
  name: 'build-commentaries',
  parallel: true,
  setup() {
    onNuxtReady(async () => {
      const commentaryCollections = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
        body: { id: 'urn:cts:cjhnt:commentary' },
        method: 'POST'
      })
      if (commentaryCollections) {
        for (const coll of commentaryCollections.member) {
          const allTexts = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
            body: { id: coll['@id'] },
            method: 'POST'
          })
          if (allTexts) {
            const parentTitle = {
              de:
                allTexts['dts:dublincore']?.['dct:alternative']?.find(
                  (t) => t['@language'] === 'deu'
                )?.['@value'] || allTexts.title,
              en:
                allTexts['dts:dublincore']?.['dct:alternative']?.find(
                  (t) => t['@language'] === 'eng'
                )?.['@value'] || allTexts.title
            }
            const textInfo = allTexts.member.map((m) => {
              const returnObject: CommentarySubcollection = {
                id: m['@id'],
                de:
                  m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'deu')?.[
                    '@value'
                  ] || m.title,
                en:
                  m['dts:extensions']['dc:title'].find((e) => e['@language'] === 'eng')?.[
                    '@value'
                  ] || m.title,
                type: m['@type'],
                parentId: coll['@id'],
                parentTitle: parentTitle,
                firstChild: '1',
                versions: [['']],
                openText:
                  m['dts:dublincore'] && m['dts:dublincore']['dct:accessRights']
                    ? m['dts:dublincore']['dct:accessRights']
                    : 'closed'
              }
              return returnObject
            })
            const asycReturn = textInfo.sort((a, b) => a.id.localeCompare(b.id))
            const chapters: CommentaryChapter[] = []
            for (const c of asycReturn) {
              const chapter = parseInt(c.id.split('.').at(-1)?.split('_')[0] || '1')
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
            commentaryListState[coll['@id']] = chapters
            asycReturn.map((e) => {
              commentarySearchListState.push({
                id: e.id,
                en: `${e.parentTitle.en} ${e.en}`,
                de: `${e.parentTitle.de} ${e.de}`,
                tab: e.parentId,
                openText: e.openText
              })
            })
          }
          commentarySearchListState.sort(
            (a, b) => ntBookList.indexOf(a.tab) - ntBookList.indexOf(b.tab)
          )
        }
      }
      useState('commentaryList', () => commentaryListState)
      useState('commentarySearchList', () => commentarySearchListState)
      useState('ntBookList', () => ntBookList)
    })
  }
})
