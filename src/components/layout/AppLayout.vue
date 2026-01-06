<template>
  <div class="flex h-screen bg-main text-txt-main transition-colors duration-300">
    <AppSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="h-16 border-b border-line flex items-center justify-between px-8 bg-main/50 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <button 
            @click="sidebarStore.toggleSidebar" 
            class="p-2 -ml-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu v-if="!sidebarStore.isCollapsed" class="w-5 h-5" />
            <ChevronRight v-else class="w-5 h-5" />
          </button>
        </div>
        
        <div class="flex items-center gap-2">
          <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
            <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
          </button>
          <div class="h-3 w-px bg-line"></div>
          <select 
            :value="locale" 
            @change="changeLanguage" 
            class="bg-transparent text-xs border-none focus:ring-0 cursor-pointer text-txt-muted hover:text-txt-main"
          >
            <option value="tr">TR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      <section class="flex-1 overflow-y-auto p-8 bg-side/30">
        <router-view />
        <AppToast />
        <AppCommandPalette v-model:open="isPaletteOpen" />
      </section>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppToast from '@/components/ui/AppToast.vue'
import AppCommandPalette from '@/components/ui/AppCommandPalette.vue'
import { useThemeStore } from '@/stores/theme'
import { useSidebarStore } from '@/stores/sidebar'
import { isPaletteOpen } from '@/stores/commandPalette'
import { Sun, Moon, Menu, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()
const { locale } = useI18n()

const changeLanguage = (event) => {
  const lang = event.target.value
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>