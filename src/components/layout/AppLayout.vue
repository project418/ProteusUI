<template>
  <div class="flex h-screen bg-main text-txt-main transition-colors duration-300 overflow-hidden">
    <AppSidebar />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <header class="h-16 border-b border-line flex items-center justify-between px-4 lg:px-8 bg-main/50 backdrop-blur-md shrink-0">
        <div class="flex items-center gap-2 lg:gap-4">
          <button @click="sidebarStore.toggleSidebar" class="hidden lg:flex p-2 -ml-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main cursor-pointer">
            <Menu v-if="!sidebarStore.isCollapsed" class="w-5 h-5" />
            <ChevronRight v-else class="w-5 h-5" />
          </button>
          <button @click="sidebarStore.toggleMobileMenu" class="lg:hidden p-2 -ml-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main cursor-pointer">
            <Menu class="w-6 h-6" />
          </button>

          <h2 class="text-sm font-bold text-txt-main lg:hidden truncate max-w-[150px]">
            {{ $t(currentRouteName) }}
          </h2>
        </div>

        <div class="flex items-center gap-1 lg:gap-2">
          <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer">
            <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
          </button>
          <div class="h-3 w-px bg-line mx-1"></div>
          <select :value="locale" @change="changeLanguage" class="bg-transparent text-xs border-none focus:ring-0 cursor-pointer text-txt-muted hover:text-txt-main py-1">
            <option value="tr">TR</option>
            <option value="en">EN</option>
          </select>
        </div>
      </header>

      <section class="flex-1 overflow-y-auto p-4 lg:p-8 bg-side/30 custom-scrollbar">
        <router-view />
        <AppToast />
        <AppCommandPalette v-model:open="isPaletteOpen" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
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
const route = useRoute()

const currentRouteName = computed(() => {
  const menuLabels = {
    'home': 'menu.home',
    'form-showcase': 'menu.events',
    'orders': 'menu.orders',
    'settings': 'menu.settings',
    'profile': 'common.profile'
  }
  return menuLabels[route.name] || ''
})

const changeLanguage = (event) => {
  const lang = event.target.value
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>