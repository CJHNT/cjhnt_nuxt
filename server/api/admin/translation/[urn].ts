import type { TranslationJson } from '~/utils/buildTranslationXml'
import buildTranslationXml from '~/utils/buildTranslationXml'

interface TranslationBody {
  editionUrn: string
  translationLang: 'deu' | 'eng'
  translationJson: TranslationJson
  citation: string
  user: string
}

export default defineEventHandler(async (event) => {
  const body: TranslationBody = await readBody(event)
  const xmlData = buildTranslationXml(body.translationJson)
  const translationUrn = getRouterParam(event, 'urn')
  const returnCode = await $fetch(`http://127.0.0.1:5001/texts/${translationUrn}`, {
    method: 'put',
    body: {
      editionUrn: body.editionUrn,
      translationLang: body.translationLang,
      translationText: xmlData,
      citation: body.citation,
      user: body.user
    }
  })
  return returnCode
})

export type { TranslationBody }
