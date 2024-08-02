import enLang from './lang/en.json'
import deLang from './lang/de.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: enLang,
    de: deLang
  }
}))
