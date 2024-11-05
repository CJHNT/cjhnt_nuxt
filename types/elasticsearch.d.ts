type EsReturnHighlightKey = 'text' | 'lemmas'

interface EsReturnHighlight {
  text?: string[]
  lemmas?: string[]
}

interface EsReturnSource {
  text: string
  lemmas: string
  citations: string
  title: string
  belegstellen: string[]
  urn: string
  collection: string
  openText: 'open' | 'closed' | ''
}

interface EsReturnShards {
  total: number
  successful: number
  skipped: number
  failed: number
}

interface EsReturnHit {
  _index: string
  _type: string
  _id: string
  _score: number
  _source: EsReturnSource
  highlight?: EsReturnHighlight
}

interface EsReturnHitObject {
  total: { value: number; relation: string }
  max_score: number
  hits: EsReturnHit[]
}

declare global {
  interface EsReturn {
    took: number
    timed_out: boolean
    _shards: EsReturnShards
    hits: EsReturnHitObject
  }
}

export {}
