import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  })
  
  const toggleTheme = useToggle(isDark)

  return { isDark, toggleTheme }
})