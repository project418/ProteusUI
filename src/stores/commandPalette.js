import { ref } from 'vue'

export const isPaletteOpen = ref(false)

export const togglePalette = () => {
  isPaletteOpen.value = !isPaletteOpen.value
}