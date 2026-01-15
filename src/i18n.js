import { createI18n } from 'vue-i18n'

const modules = import.meta.glob('./locales/*.json', { eager: true })

const messages = {}
export const supportedLocales = []

for (const path in modules) {
  const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i)
  if (matched && matched.length > 1) {
    const locale = matched[1]
    messages[locale] = modules[path].default
    supportedLocales.push(locale)
  }
}

const systemLang = navigator.language.split('-')[0]
const savedLang = localStorage.getItem('lang')
const locale = savedLang || (messages[systemLang] ? systemLang : 'en')

const i18n = createI18n({
  legacy: false,
  locale: locale,
  fallbackLocale: 'en',
  messages
})

export const getLanguageName = (code) => {
  try {
    const displayNames = new Intl.DisplayNames([code], { type: 'language' });
    return displayNames.of(code);
  } catch {
    return code.toUpperCase();
  }
}

export default i18n