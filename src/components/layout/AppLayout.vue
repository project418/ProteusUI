<template>
  <div class="flex h-screen bg-main text-txt-main transition-colors duration-300 overflow-hidden">
    <AppSidebar v-if="authStore.hasTenant" />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <AppHeader :showSidebarToggle="authStore.hasTenant" />

      <section class="flex-1 overflow-y-auto p-4 lg:p-8 bg-side/30 custom-scrollbar">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>