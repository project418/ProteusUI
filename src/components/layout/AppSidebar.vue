<template>
  <div v-if="sidebarStore.isMobileOpen" @click="sidebarStore.isMobileOpen = false" class="fixed inset-0 bg-main/40 backdrop-blur-sm z-[100] lg:hidden"></div>

  <aside :class="[
    sidebarStore.isCollapsed ? 'w-20' : 'w-64',
    sidebarStore.isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]" class="fixed lg:static inset-y-0 left-0 z-[101] flex flex-col border-r border-line bg-side p-2 overflow-visible transition-all duration-300 ease-in-out">

    <div class="relative h-14 mb-6 border-b border-line">
      <AppDropdown :isCollapsed="sidebarStore.isCollapsed" position="bottom">
        <template #trigger>
          <div :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'justify-between px-2']" class="w-full flex items-center py-2 hover:bg-main/50 rounded-lg border border-transparent transition-all cursor-pointer group">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-6 h-6 shrink-0 rounded flex items-center justify-center shadow-sm text-[10px] font-bold text-white transition-colors" :class="currentTenantColor">
                {{ currentTenantInitials }}
              </div>

              <span v-if="!sidebarStore.isCollapsed" class="text-sm font-semibold text-txt-main tracking-tight truncate">
                {{ currentTenantName }}
              </span>
            </div>
            <ChevronDown v-if="!sidebarStore.isCollapsed" class="w-4 h-4 text-txt-muted shrink-0 group-hover:text-txt-main transition-colors" />
          </div>
        </template>

        <template #content="{ close }">
          <div class="space-y-1">
            <div v-if="authStore.availableTenants.length === 0" class="px-2 py-2 text-xs text-txt-muted italic text-center">
              {{ $t('menu.noOrganizations') }}
            </div>

            <button v-for="tenant in authStore.availableTenants" :key="tenant.id" @click="handleSwitchTenant(tenant.id); close()" class="w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-all text-left group" :class="authStore.currentTenant?.id === tenant.id ? 'bg-main shadow-sm text-txt-main border border-line/50' : 'hover:bg-side text-txt-muted hover:text-txt-main border border-transparent'">
              <div class="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0" :class="getTenantColor(tenant.name)">
                {{ getInitials(tenant.name) }}
              </div>
              <span class="truncate flex-1">{{ tenant.name }}</span>
              <Check v-if="authStore.currentTenant?.id === tenant.id" class="w-3.5 h-3.5 text-txt-main" />
            </button>
          </div>

          <div class="h-px bg-line my-1.5 mx-1"></div>

          <button @click="openCreateTenantModal(); close()" class="w-full flex items-center gap-3 p-2 hover:bg-main hover:shadow-sm rounded-lg text-sm text-txt-muted hover:text-txt-main cursor-pointer transition-all group border border-transparent hover:border-line/50">
            <div class="w-5 h-5 border border-dashed border-txt-muted/40 rounded flex items-center justify-center group-hover:border-txt-main group-hover:bg-txt-main group-hover:text-main transition-all">
              <Plus class="w-3 h-3" />
            </div>
            <span class="font-medium">{{ $t('menu.newOrganization') }}</span>
          </button>
        </template>
      </AppDropdown>
    </div>

    <nav class="flex-1 space-y-1 mb-8">
      <router-link v-for="item in menuItems" :key="item.label" :to="item.path" @click="sidebarStore.isMobileOpen = false" active-class="bg-main text-txt-main shadow-sm border-line" :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'px-3']" class="flex items-center gap-3 py-2 rounded-lg text-sm font-medium transition-all group text-txt-muted hover:text-txt-main hover:bg-main/50 border border-transparent">
        <component :is="item.icon" class="w-5 h-5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
        <span v-if="!sidebarStore.isCollapsed" class="truncate">{{ $t(item.label) }}</span>
      </router-link>
    </nav>

    <div class="mt-auto pt-2 border-t border-line">
      <AppDropdown :isCollapsed="sidebarStore.isCollapsed" position="top">
        <template #trigger>
          <div :class="[sidebarStore.isCollapsed ? 'justify-center px-0' : 'px-2']" class="w-full flex items-center gap-3 py-2 hover:bg-main/50 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-line/50">
            <img :src="displayAvatar" class="w-8 h-8 rounded-lg border border-line shrink-0 object-cover" alt="Avatar" />

            <div v-if="!sidebarStore.isCollapsed" class="flex-1 text-left min-w-0">
              <p class="text-sm font-semibold text-txt-main truncate leading-tight">{{ displayName }}</p>
              <p class="text-[10px] text-txt-muted truncate font-medium mt-0.5">{{ userEmail }}</p>
            </div>
            <ChevronUp v-if="!sidebarStore.isCollapsed" class="w-4 h-4 text-txt-muted shrink-0 group-hover:text-txt-main transition-colors" />
          </div>
        </template>

        <template #content="{ close }">
          <div class="p-1 bg-side rounded-xl flex mb-2 border border-line">
            <button @click="themeStore.isDark = false" :class="[!themeStore.isDark ? 'bg-card shadow-sm text-txt-main' : 'text-txt-muted hover:text-txt-main']" class="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
              <Sun class="w-3.5 h-3.5" /> Light
            </button>
            <button @click="themeStore.isDark = true" :class="[themeStore.isDark ? 'bg-card shadow-sm text-txt-main' : 'text-txt-muted hover:text-txt-main']" class="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
              <Moon class="w-3.5 h-3.5" /> Dark
            </button>
          </div>

          <div class="space-y-0.5 mb-2">
            <button v-for="lang in supportedLocales" :key="lang" @click="setLanguage(lang)" class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer group" :class="[locale === lang ? 'bg-main text-txt-main border border-line/50' : 'text-txt-muted hover:bg-side border border-transparent']">
              <span class="capitalize">{{ getLanguageName(lang) }}</span>
              <Check v-if="locale === lang" class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="h-px bg-line mx-1 mb-1"></div>

          <button @click="redirectToAccount(); sidebarStore.isMobileOpen = false; close()" class="w-full flex items-center gap-3 px-3 py-2 hover:bg-side rounded-lg text-xs font-medium text-txt-main cursor-pointer transition-colors">
            <UserCircle class="w-4 h-4 opacity-60" /> {{ $t('common.account') }}
          </button>

          <button @click="openLogoutModal(); close()" class="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg text-xs font-medium text-red-500 cursor-pointer transition-colors">
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
import { supportedLocales, getLanguageName } from '@/i18n'
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebar';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import {
  Home, Calendar, ShoppingCart, Settings,
  ChevronDown, ChevronUp, UserCircle, LogOut, Sun, Moon,
  Check, Plus
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

// Tenant Computed Properties
const currentTenantName = computed(() => authStore.currentTenant?.name || 'Organizasyon Seç');
const currentTenantInitials = computed(() => getInitials(currentTenantName.value));
const currentTenantColor = computed(() => authStore.currentTenant ? getTenantColor(authStore.currentTenant.name) : 'bg-gray-500');

// User Computed Properties
const userEmail = computed(() => authStore.user?.email || 'user@proteus.com');
const displayName = computed(() => {
  if (authStore.user?.firstName && authStore.user?.lastName) {
    return `${authStore.user.firstName} ${authStore.user.lastName}`;
  }
  return authStore.user?.email?.split('@')[0] || 'Kullanıcı';
});
const displayAvatar = computed(() => {
  if (authStore.user?.avatar) return authStore.user.avatar;
  return `https://ui-avatars.com/api/?name=${displayName.value}&background=333&color=fff`;
});

// Helpers
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getTenantColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const setLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('lang', lang);
};

// Tenant Actions
const handleSwitchTenant = async (tenantId) => {
  if (authStore.currentTenant?.id === tenantId) return;

  await authStore.switchTenant(tenantId);
};

const openCreateTenantModal = () => {
  sidebarStore.isTenantModalOpen = true;
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