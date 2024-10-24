interface SubCollectionList {
  id: string
  de: string
  en: string
  type: string
  versions: string[][]
  parentId: string
  firstChild: string
}
const wissensSpeicher = {
  wissen_texts: [] as { id: string; title: string; subCollections: SubCollectionList[] }[]
}

export default defineNuxtPlugin({
  name: 'build-wissen',
  parallel: true,
  setup() {
    onNuxtReady(async () => {
      const wissenTexts = await $fetch<DtsNonReadableCollection>('/api/dts/collections', {
        body: { id: 'wissen_texts' },
        method: 'POST'
      })
      if (wissenTexts) {
        wissensSpeicher.wissen_texts = [
          {
            id: 'wissen_texts',
            title: '',
            subCollections: wissenTexts.member.map((text) => {
              const wissenObject = {
                id: text['@id'],
                de:
                  text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'deu')?.[
                    '@value'
                  ] || text.title,
                en:
                  text['dts:extensions']['dc:title'].find((t) => t['@language'] === 'eng')?.[
                    '@value'
                  ] || text.title,
                type: text['@type'],
                versions: [['']],
                parentId: 'wissen_texts',
                firstChild: '1'
              }
              return wissenObject
            })
          }
        ]
      }

      useState('wissensSpeicher', () => wissensSpeicher)
    })
  }
})
