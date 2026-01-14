<template>
  <div v-if="sidebarStore.isMobileOpen" @click="sidebarStore.isMobileOpen = false" class="fixed inset-0 bg-main/40 backdrop-blur-sm z-[100] lg:hidden"></div>

  <aside :class="[
    sidebarStore.isCollapsed ? 'w-20' : 'w-64',
    sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]" class="fixed lg:static inset-y-0 left-0 z-[101] flex flex-col border-r border-line bg-side p-2 overflow-visible transition-all duration-300 ease-in-out">

    <div class="relative h-14 mb-6 border-b border-line">
      <AppDropdown :isCollapsed="sidebarStore.isCollapsed" position="bottom">
        <template #trigger>
          <div :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'justify-between px-2']" class="w-full flex items-center py-2 hover:bg-main/50 rounded-lg border border-transparent transition-all">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-6 h-6 shrink-0 bg-main border border-line rounded flex items-center justify-center shadow-sm">
                <div class="w-3 h-3 border-[1.5px] border-txt-main rounded-full opacity-90"></div>
              </div>
              <span v-if="!sidebarStore.isCollapsed" class="text-sm font-semibold text-txt-main tracking-tight truncate">Proteus</span>
            </div>
            <ChevronDown v-if="!sidebarStore.isCollapsed" class="w-4 h-4 text-txt-muted shrink-0" />
          </div>
        </template>

        <template #content>
          <div class="space-y-1">
            <button class="w-full flex items-center gap-3 p-2 hover:bg-side rounded-lg text-sm text-txt-main cursor-pointer">
              <div class="w-5 h-5 bg-red-500 rounded flex items-center justify-center text-[10px] font-bold text-white">A1</div>
              App 1
            </button>
          </div>
        </template>
      </AppDropdown>
    </div>

    <nav class="flex-1 space-y-1 mb-8">
      <router-link v-for="item in menuItems" :key="item.label" :to="item.path" @click="sidebarStore.isMobileOpen = false" active-class="bg-main text-txt-main" :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'px-3']" class="flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-all group text-txt-muted hover:text-txt-main hover:bg-main/50">
        <component :is="item.icon" class="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100" />
        <span v-if="!sidebarStore.isCollapsed" class="truncate">{{ $t(item.label) }}</span>
      </router-link>
    </nav>

    <div class="mt-auto pt-2 border-t border-line">
      <AppDropdown :isCollapsed="sidebarStore.isCollapsed" position="top">
        <template #trigger>
          <div :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'px-2']" class="w-full flex items-center gap-3 py-2 hover:bg-main/50 rounded-xl transition-all group cursor-pointer">
            <img :src="userAvatar" class="w-8 h-8 rounded-lg border border-line shrink-0" alt="Avatar" />

            <div v-if="!sidebarStore.isCollapsed" class="flex-1 text-left min-w-0">
              <p class="text-sm font-semibold text-txt-main truncate">{{ userName }}</p>
              <p class="text-[11px] text-txt-muted truncate font-medium">{{ userEmail }}</p>
            </div>
            <ChevronUp v-if="!sidebarStore.isCollapsed" class="w-4 h-4 text-txt-muted shrink-0" />
          </div>
        </template>

        <template #content="{ close }">
          <div class="p-1 bg-side rounded-xl flex mb-2 border border-line">
            <button @click="themeStore.isDark = false" :class="[!themeStore.isDark ? 'bg-card shadow-sm text-txt-main' : 'text-txt-muted']" class="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer">
              <Sun class="w-3.5 h-3.5" /> Light
            </button>
            <button @click="themeStore.isDark = true" :class="[themeStore.isDark ? 'bg-card shadow-sm text-txt-main' : 'text-txt-muted']" class="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer">
              <Moon class="w-3.5 h-3.5" /> Dark
            </button>
          </div>

          <div class="space-y-0.5 mb-2">
            <button v-for="lang in [{ id: 'en', n: 'English' }, { id: 'tr', n: 'Türkçe' }]" :key="lang.id" @click="setLanguage(lang.id)" class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer" :class="[locale === lang.id ? 'bg-main text-txt-main' : 'text-txt-muted hover:bg-side']">
              <span>{{ lang.n }}</span>
              <Check v-if="locale === lang.id" class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="h-px bg-line mx-1 mb-1"></div>

          <button @click="redirectToAccount(); sidebarStore.isMobileOpen = false; close()" class="w-full flex items-center gap-3 px-3 py-2 hover:bg-side rounded-lg text-xs text-txt-main cursor-pointer">
            <UserCircle class="w-4 h-4 opacity-60" /> {{ $t('common.account') }}
          </button>

          <button @click="openLogoutModal(); close()" class="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-xs text-red-500 cursor-pointer">
            <LogOut class="w-4 h-4" /> {{ $t('auth.logout') }}
          </button>
        </template>
      </AppDropdown>
    </div>

    <AppModal :show="showLogoutModal" title="Oturumu Kapat" size="sm" @close="showLogoutModal = false">
      <div class="text-center py-4">
        <div class="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut class="w-6 h-6" />
        </div>
        <p class="text-sm font-bold text-txt-main">Çıkış Yapılıyor</p>
        <p class="text-xs text-txt-muted mt-2 max-w-[220px] mx-auto leading-relaxed">
          Hesabınızdan çıkış yapmak istediğinize emin misiniz?
        </p>
      </div>
      <template #footer>
        <button @click="showLogoutModal = false" class="px-4 py-2 text-xs font-bold text-txt-muted hover:text-txt-main transition-colors">Vazgeç</button>
        <button @click="confirmLogout" class="px-6 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">Çıkış Yap</button>
      </template>
    </AppModal>

  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebar';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import {
  Home, Calendar, ShoppingCart, Settings,
  ChevronDown, ChevronUp, UserCircle, LogOut, Sun, Moon,
  Check,
} from 'lucide-vue-next';
import AppDropdown from '@/components/ui/AppDropdown.vue';
import AppModal from '@/components/ui/AppModal.vue';

const { locale } = useI18n();
const router = useRouter();
const sidebarStore = useSidebarStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();

// Modal State
const showLogoutModal = ref(false);

const userEmail = computed(() => authStore.user?.email || 'user@proteus.com');
const userName = computed(() => userEmail.value.split('@')[0]);
const userAvatar = computed(() => `https://ui-avatars.com/api/?name=${userName.value}&background=333&color=fff`);

const setLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('lang', lang);
};

const menuItems = [
  { path: '/', label: 'menu.home', icon: Home },
  { path: '/form-showcase', label: 'menu.events', icon: Calendar },
  { path: '/orders', label: 'menu.orders', icon: ShoppingCart },
  { path: '/settings', label: 'menu.settings', icon: Settings },
];

const redirectToAccount = () => {
  router.push('/profile');
};

const openLogoutModal = () => {
  showLogoutModal.value = true;
};

const confirmLogout = async () => {
  showLogoutModal.value = false;
  await authStore.logout();
};
</script>