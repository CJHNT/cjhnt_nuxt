import enLang from './lang/en.json'
import deLang from './lang/de.json'
import { en, de } from 'vuetify/locale'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: { ...enLang, $vuetify: en },
    de: { ...deLang, $vuetify: de }
  }
}))
