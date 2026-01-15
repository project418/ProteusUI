<template>
    <header class="h-16 border-b border-line flex items-center justify-between px-4 lg:px-8 bg-main/50 backdrop-blur-md shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-2 lg:gap-4">

            <template v-if="showSidebarToggle">
                <button @click="sidebarStore.toggleSidebar" class="hidden lg:flex p-2 -ml-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main cursor-pointer">
                    <Menu v-if="!sidebarStore.isCollapsed" class="w-5 h-5" />
                    <ChevronRight v-else class="w-5 h-5" />
                </button>
                <button @click="sidebarStore.toggleMobileMenu" class="lg:hidden p-2 -ml-2 hover:bg-side rounded-lg transition-colors text-txt-muted hover:text-txt-main cursor-pointer">
                    <Menu class="w-6 h-6" />
                </button>
            </template>

            <div v-else class="flex items-center gap-2 text-txt-main font-bold tracking-tight">
                <div class="w-8 h-8 bg-txt-main text-main rounded-lg flex items-center justify-center shadow-sm">
                    <Layers class="w-4 h-4" />
                </div>
                <span class="text-lg">Proteus</span>
            </div>

            <h2 class="text-sm font-bold text-txt-main lg:hidden truncate max-w-[150px]">
                {{ $t(currentRouteName) }}
            </h2>
        </div>

        <div class="flex items-center gap-2 lg:gap-3">
            <button @click="themeStore.toggleTheme()" class="p-2 hover:bg-side rounded-lg text-txt-muted hover:text-txt-main cursor-pointer transition-colors" :title="themeStore.isDark ? $t('header.lightMode') : $t('header.darkMode')">
                <component :is="themeStore.isDark ? Sun : Moon" class="w-4 h-4" />
            </button>

            <div class="h-4 w-px bg-line"></div>

            <div class="relative flex items-center">
                <select :value="locale" @change="changeLanguage" class="appearance-none bg-transparent text-xs font-bold uppercase border-none focus:ring-0 cursor-pointer text-txt-muted hover:text-txt-main py-1 pl-1 pr-3 outline-none text-center">
                    <option v-for="lang in supportedLocales" :key="lang" :value="lang">
                        {{ lang.toUpperCase() }}
                    </option>
                </select>
                <ChevronDown class="absolute right-0 w-3 h-3 text-txt-muted pointer-events-none opacity-50" />
            </div>

            <template v-if="!showSidebarToggle">
                <div class="h-4 w-px bg-line"></div>

                <router-link to="/home" class="p-2 text-txt-muted hover:text-txt-main transition-colors rounded-lg hover:bg-side" :title="$t('header.home')">
                    <Home class="w-4 h-4" />
                </router-link>

                <router-link to="/profile" class="p-2 text-txt-muted hover:text-txt-main transition-colors rounded-lg hover:bg-side" :title="$t('header.profileSettings')">
                    <User class="w-4 h-4" />
                </router-link>

                <button @click="handleLogout" class="p-2 text-txt-muted hover:text-rose-500 transition-colors rounded-lg hover:bg-side" :title="$t('header.logout')">
                    <LogOut class="w-4 h-4" />
                </button>
            </template>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useSidebarStore } from '@/stores/sidebar'
import { useAuthStore } from '@/stores/auth'
import { Sun, Moon, Menu, ChevronRight, Layers, Home, User, LogOut, ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { supportedLocales } from '@/i18n'

defineProps({
    showSidebarToggle: {
        type: Boolean,
        default: true
    }
})

const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()
const authStore = useAuthStore()
const router = useRouter()
const { locale } = useI18n()
const route = useRoute()

const currentRouteName = computed(() => {
    const menuLabels = {
        'home': 'menu.home',
        'form-showcase': 'menu.events',
        'orders': 'menu.orders',
        'settings': 'menu.settings',
        'profile': 'common.profile',
        'onboarding': 'Hoş Geldiniz'
    }
    return menuLabels[route.name] || ''
})

const changeLanguage = (event) => {
    const lang = event.target.value
    locale.value = lang
    localStorage.setItem('lang', lang)
}

const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>