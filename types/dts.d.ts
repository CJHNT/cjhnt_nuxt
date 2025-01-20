interface DtsCiteStructure {
  'dts:citeType': string
  'dts:citeStructure'?: DtsCiteStructure[]
}

interface DtsExtensions {
  'dc:rights': string
  'dc:title': { '@value': string; '@language': string }[]
  'dc:format': string
  'dc:type': string
  'dc:language': string
}

interface DtsDublinCore {
  'dct:bibliographicCitation': { '@value': string; '@language': string }[]
  'dct:accessRights'?: 'open' | 'closed'
  'dct:isPartOf': { '@id': string }[]
  'dct:alternative'?: { '@value': string; '@language': string }[]
}

interface DtsCollection {
  '@id': string
  '@type': string
  title: string
  totalItems: number
  'dts:extensions': DtsExtensions
  'dts:dublincore'?: DtsDublinCore
  '@context': DtsContext
}

declare global {
  type DtsNamespaces = 'dct' | 'dts' | 'dc' | '@vocab' | `ns${number}` | 'hydra'

  interface DtsContext {
    [key: DtsNamespaces]: string
  }

  interface DtsReadableCollection extends DtsCollection {
    'dts:passage': string
    'dts:references': string
    'dts:citeDepth': number
    'dts:citeStructure': DtsCiteStructure
  }

  interface DtsNonReadableCollection extends DtsCollection {
    member: DtsReadableCollection[]
  }

  interface DtsNavigation {
    '@context': DtsContext
    level: number
    passage: string
    '@id': string
    'hydra:member': { ref: string }[]
    citeDepth: number
    citeType: string
  }
}

export {}
