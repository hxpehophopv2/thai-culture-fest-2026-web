import { ref } from 'vue'

const locale = ref('th-TH') // GLOBAL

export function useLocale() {
  const toggleLocale = () => {
    locale.value = locale.value === 'th-TH' ? 'en-US' : 'th-TH'
  }

  const t = (translations) => translations[locale.value] ?? translations['th-TH']

  return { locale, toggleLocale, t }
}
